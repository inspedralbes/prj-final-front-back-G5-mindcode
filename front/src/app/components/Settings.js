import React, { useState } from "react";
import Button from "app/components/atoms/Button";
import Dialog from "app/components/atoms/Dialog"; // Importa el componente de diálogo
import { updateUserInfo } from "services/communicationManager";
import Snackbar from "app/components/atoms/Snackbar";
import { useRouter } from "next/navigation";

const Settings = ({ id, name: initialName, gmail }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(initialName);
    const [editedName, setEditedName] = useState(name);
    const [snackbar, setSnackbar] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false); 
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
        <div className="bg-gray-50 dark:bg-gray-800 shadow-2xl shadow-gray-600 dark:shadow-black rounded-2xl p-8 w-[28rem] h-[20rem] items-center justify-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-4">
                <strong>El meu usuari</strong>
            </h2>
            <div className="space-y-3">
                {isEditing ? (
                    <>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">
                                <strong>Nom:</strong>
                            </label>
                            <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-300"
                            />
                        </div>
                        <Button
                            text="Guardar"
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-400"
                            onClick={handleSave}
                        />
                        <Button
                            text="Cancelar"
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-400 ml-2"
                            onClick={() => setIsEditing(false)}
                        />
                    </>
                ) : (
                    <>
                        <p className="text-gray-700 dark:text-gray-300">
                            <strong>Nom:</strong> {name}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <strong>Email:</strong> {gmail}
                        </p>
                        <Button
                            text="Editar dades"
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-400"
                            onClick={() => setIsEditing(true)}
                        />
                        <Button
                            text="Log Out"
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-400 ml-2"
                            onClick={() => setIsDialogOpen(true)}
                        />
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
                    onConfirm={handleLogout} // Llama a handleLogout al confirmar
                    onCancel={() => setIsDialogOpen(false)} // Cierra el diálogo al cancelar
                />
            )}
        </div>
    );
};

export default Settings;