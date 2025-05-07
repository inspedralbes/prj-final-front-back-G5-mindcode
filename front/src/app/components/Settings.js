import React, { useState, useRef, useEffect } from "react";
import Button from "app/components/atoms/Button";
import Dialog from "app/components/atoms/Dialog";
import { updateUserInfo, getUserImage, uploadUserImage } from "services/communicationManager";
import Snackbar from "app/components/atoms/Snackbar";
import { useRouter } from "next/navigation";
import { useAuthStore } from '../../stores/authStore';

const Settings = ({ id, name: initialName, gmail }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(initialName);
    const [editedName, setEditedName] = useState(name);
    const [snackbar, setSnackbar] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const user_info = useAuthStore.getState().user_info;
    const router = useRouter();

    const [photoURL, setPhotoURL] = useState(user_info?.photoURL || null);
    const [userImage, setUserImage] = useState(null);
    const [previewPhoto, setPreviewPhoto] = useState(user_info?.photoURL || null);
    const [tempImagePreview, setTempImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchUserImage = async () => {
            try {
                const img = await getUserImage(id);
                setUserImage(img);
                setTempImagePreview(img);
            } catch (error) {
                console.error("Error fetching user image:", error);
            }
        };

        fetchUserImage();
    }, [id]);

    const handleSave = async () => {
        try {
            await updateUserInfo({ 
                id, 
                name: editedName, 
                gmail,
                photoURL: previewPhoto 
            });
            
            setName(editedName);
            setPhotoURL(previewPhoto);
            setUserImage(tempImagePreview);
            setIsEditing(false);
            setSnackbar({ message: "Dades actualitzades correctament!" });
        } catch (error) {
            setSnackbar({ message: "Error al actualitzar les dades." });
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem("auth-storage");
        router.push("/Login");
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setTempImagePreview(objectUrl);

            try {
                const uploadedImageUrl = await uploadUserImage(id, file);
                setPreviewPhoto(uploadedImageUrl);
                URL.revokeObjectURL(objectUrl);
                setTempImagePreview(uploadedImageUrl);
            } catch (error) {
                console.error('Error uploading image:', error);
                setSnackbar({ message: "Error al cargar la imagen." });
            }
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleCancel = () => {
        setEditedName(name);
        setTempImagePreview(userImage || photoURL);
        setIsEditing(false);
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-2xl rounded-2xl p-6 w-[450px] transition-all duration-300 hover:shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 relative">
                    El meu usuari
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform translate-y-2"></span>
                </h2>
            </div>

            <div className="space-y-6">
                {isEditing ? (
                    <>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700">
                            <div className="flex flex-row gap-6 items-center">
                                <div className="flex-1">
                                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 block">
                                        Nom
                                    </label>
                                    <input
                                        type="text"
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 transition-all duration-200"
                                        placeholder="Introdueix el teu nom"
                                    />
                                </div>
                                
                                <div className="flex flex-col items-center justify-center">
                                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 block">
                                        Foto
                                    </label>
                                    <div className="relative group">
                                        <div className="w-14 h-14 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-700 shadow-lg transition-all duration-300 group-hover:ring-blue-400">
                                            <img 
                                                src={tempImagePreview || userImage || user_info.photoURL} 
                                                className="w-full h-full object-cover cursor-pointer"
                                                alt="Foto de perfil"
                                                onClick={triggerFileInput}
                                            />
                                        </div>
                                        <div 
                                            className="absolute -bottom-3 right-0 bg-blue-600 rounded-full p-2 cursor-pointer transform transition-transform duration-300 hover:scale-110 shadow-md"
                                            onClick={triggerFileInput}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </div>
                                        <input 
                                            type="file" 
                                            ref={fileInputRef}
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-end mt-6 space-x-4">
                            <Button
                                children="Cancelar"
                                className="px-6 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
                                onClick={handleCancel}
                            />
                            <Button
                                children="Guardar"
                                className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                                onClick={handleSave}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border border-gray-100 dark:border-gray-700">
                            <div className="flex flex-row gap-6 items-center">
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Nom</h4>
                                    <div className="ml-1">
                                        <p className="text-xl font-medium text-gray-900 dark:text-gray-100">
                                            {name}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col items-center justify-center">
                                    <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Foto</h4>
                                    <div className="w-14 h-14 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-700 shadow-lg">
                                        <img 
                                            src={userImage || photoURL} 
                                            className="w-full h-full object-cover"
                                            alt="Foto de perfil"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border border-gray-100 dark:border-gray-700">
                            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Email</h4>
                            <div className="ml-1">
                                <p className="text-xl font-medium text-gray-900 dark:text-gray-100 break-all">
                                    {gmail}
                                </p>
                            </div>
                        </div>
                        
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                                <Button
                                    children="Editar dades"
                                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                                    onClick={() => setIsEditing(true)}
                                />
                                <Button
                                    children="Tancar sessió"
                                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border border-red-400 dark:border-red-500 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                                    onClick={() => setIsDialogOpen(true)}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
            
            {snackbar && (
                <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50 w-96">
                <Snackbar
                    message={snackbar.message}
                    onClose={() => setSnackbar(null)}
                />
                </div>
            )}
            
            {isDialogOpen && (
                <Dialog
                    title="Confirmació"
                    message="Estàs segur que vols tancar la sessió?"
                    onConfirm={handleLogout}
                    onCancel={() => setIsDialogOpen(false)}
                />
            )}
        </div>
    );
};

export default Settings;