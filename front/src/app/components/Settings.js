import React, { useState } from "react";
import Button from "app/components/atoms/Button";
import Dialog from "app/components/atoms/Dialog";
import { updateUserInfo } from "services/communicationManager";
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

    const handleSave = async () => {
        try {
            await updateUserInfo({ id, name: editedName, gmail });
            setName(editedName);
            setIsEditing(false);
            setSnackbar({ message: "Nom actualitzat correctament!" });
        } catch (error) {
            setSnackbar({ message: "Error al actualitzar el nom." });
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem("auth-storage");
        router.push("/Login");
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 shadow-lg rounded-xl p-8 max-w-md mx-auto transition-all duration-300 hover:shadow-xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    El meu usuari
                </h2>
                <div className="relative">
                <img 
                    src={user_info.photoURL} 
                    className="w-16 h-16 rounded-full object-cover absolute top-4 right-4"
                />
                </div>
            </div>

            <div className="space-y-6">
                {isEditing ? (
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Nom
                        </label>
                        <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 transition-all duration-200"
                            placeholder="Introdueix el teu nom"
                        />
                        
                        <div className="flex justify-end mt-4 space-x-3">
                            <Button
                                text="Cancelar"
                                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                onClick={() => {
                                    setEditedName(name);
                                    setIsEditing(false);
                                }}
                            />
                            <Button
                                text="Guardar"
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                onClick={handleSave}
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Nom</span>
                                <span className="text-lg font-medium text-gray-900 dark:text-gray-100">{name}</span>
                            </div>
                            
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Email</span>
                                <span className="text-lg font-medium text-gray-900 dark:text-gray-100 break-all">{gmail}</span>
                            </div>
                        </div>
                        
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                                <Button
                                    text="Editar dades"
                                    className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                                    onClick={() => setIsEditing(true)}
                                />
                                <Button
                                    text="Tancar sessió"
                                    className="flex-1 px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-500 dark:hover:bg-red-900/20 transition-colors"
                                    onClick={() => setIsDialogOpen(true)}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
            
            {snackbar && (
                <Snackbar
                    message={snackbar.message}
                    onClose={() => setSnackbar(null)}
                />
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