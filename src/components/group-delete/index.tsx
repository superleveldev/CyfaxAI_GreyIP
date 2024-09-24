import { useState } from "react";  
import { FormattedMessage } from "react-intl";  
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";  
import { Eye, EyeOff } from 'lucide-react';  
import { toast } from "react-toastify";  
import { getAuthTokenOnClient } from "@/lib/utils";  

interface GroupDeleteProps {  
    onClose: () => void;  
    groupId: string;  
    onDelete: (groupId: string) => void;
}  

const DeleteGroup = ({ groupId, onClose, onDelete }: GroupDeleteProps) => {  
    const [isPasswordVisible, setPasswordVisible] = useState(false);   
    const [password, setPassword] = useState("");   
    const [error, setError] = useState("");  

    const togglePasswordVisibility = () => {  
        setPasswordVisible(!isPasswordVisible);  
    };   

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {  
        setPassword(event.target.value);  
        setError(""); 
    };   

    const handleSubmit = async (event: React.FormEvent) => {  
        event.preventDefault();  
    
        const apiUrl = `${process.env.NEXT_PUBLIC_CYFAX_API_BASE_URL}/group/${groupId}/`;  
        const requestBody = { password };  
        const tokens = await getAuthTokenOnClient();  
    
        try {  
            const response = await fetch(apiUrl, {  
                method: 'DELETE', // Use uppercase HTTP methods  
                headers: {  
                    'Content-Type': 'application/json',  
                    'Authorization': `Bearer ${tokens.accessToken}`,  
                },  
                body: JSON.stringify(requestBody),  
            });  
    
            if (!response.ok) {  
                const errorResponse = await response.json(); 
                throw new Error(errorResponse.data);
            }  
            
            toast.success("Group deleted successfully."); 
            onDelete(groupId);
            onClose(); 
        } catch (error) {  
            console.error('Failed to delete group:', error);  
            const errorMessage = typeof error === "object" && error !== null && "message" in error ? error.message : String(error);  
            toast.error(`Failed to delete the group. ${errorMessage}`);   
        }  
    };

    return (  
        <>  
            <Dialog open>  
                <DialogContent className="w-full max-w-[550px] p-4 max-sm:max-w-[95vw] md:p-5">  
                    <DialogHeader>  
                    <DialogTitle>  
                    <div className="flex w-full items-center justify-between">  
                        <div className="flex flex-1 justify-center">  
                            <h2 className="text-xl font-semibold text-[#ab00ab]">  
                                <FormattedMessage id="deleteProfileTitle" />  
                            </h2>  
                        </div>  
                        <button onClick={onClose} className="ml-auto text-[#ab00ab]">X</button>  
                    </div>  
                    </DialogTitle>  
                    </DialogHeader>  
                    <div className="mt-7">  
                        <form onSubmit={handleSubmit}>  
                            <label htmlFor="password" style={{ fontSize: '15px' }} className="mb-2 block font-semibold text-gray-900">  
                                <FormattedMessage id="enterPasswordLabel"/>  
                            </label>  
                            <div className="relative">  
                                <input  
                                    id="password"  
                                    type={isPasswordVisible ? "text" : "password"}  
                                    className="mb-2 h-11 w-full rounded-lg border px-3 text-sm outline-none placeholder:text-sm md:text-base md:placeholder:text-base lg:h-12 lg:px-4"  
                                    placeholder="enter password"  
                                    value={password}  
                                    onChange={handlePasswordChange}  
                                />  
                                <span className="absolute inset-y-0 right-4 flex items-center">  
                                    {isPasswordVisible ? (  
                                    <EyeOff className="cursor-pointer" onClick={togglePasswordVisibility} />  
                                    ) : (  
                                    <Eye className="cursor-pointer" onClick={togglePasswordVisibility} />  
                                    )}  
                                </span>  
                            </div>  
                            {error && <p className="text-sm text-red-500">{error}</p>}  
                            <div className="mt-3.5 flex justify-end">  
                                <button  
                                className="h-11 rounded-md bg-accent px-8 font-medium text-white duration-300 enabled:hover:opacity-80 disabled:opacity-50"  
                                type="submit"  
                                disabled={!password}  
                                >  
                                <FormattedMessage id="confirmDeletion" />  
                                </button>  
                            </div>  
                        </form>  
                    </div>  
                </DialogContent>  
            </Dialog>   
        </>  
    );  
};  

export default DeleteGroup;