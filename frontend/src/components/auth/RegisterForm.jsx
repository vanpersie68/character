import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import { signUpSchema } from "../../utils/validation";
import AuthInput from "./AuthInput";
import {useDispatch, useSelector} from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { changeStatus, registerUser } from "../features/userSlice";

export default function RegisterForm(){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const status = useSelector((state) => state.user.status);
    const error = useSelector((state) => state.user.error);

    // Use the useForm hook function of react-hook-form to get the desired properties and methods by deconstructing the assignment
    const {register, handleSubmit, formState: {errors}, } = useForm({
        // Use yupResolver to apply yup validation mode to the form
        resolver: yupResolver(signUpSchema),
    });

    // Callback function for form submission to process the submitted data
    const onSubmit = async (data) => {
        dispatch(changeStatus("loading"));
        
        let res = await dispatch(
            registerUser({ ...data })
        );    

        if(res?.payload?.user){
            navigate("/");
        }
    };

    return (
        <div className="h-screen w-full flex items-center justify-center overflow-hidden">
            <div className="max-w-md space-y-8 p-10 dark:bg-dark_bg_2 rounded-xl">
                {/* Heading */}
                <div className="text-center dark:text-dark_text_1">
                    <h2 className="mt-6 text-3xl font-bold">Welcome</h2>
                    <p className="mt-2 text-sm">Sign up</p>
                </div>

                {/* Form */}
                <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <AuthInput name="firstname" type="text" placeholder="First Name" 
                        register={register} nameerror={errors?.firstname?.message} />

                    <AuthInput name="lastname" type="text" placeholder="Last Name" 
                        register={register} error={errors?.lastname?.message} />

                    <AuthInput name="email" type="text" placeholder="Email Address"
                        register={register} error={errors?.email?.message} />

                    <AuthInput name="password" type="password" placeholder="Password"
                        register={register} error={errors?.password?.message} />

                

                    {error ? (<div>
                        <p className="text-red-400">{error}</p>
                    </div>) : null}

                    <button className="w-full flex justify-center bg-green_1 text-gray-100 p-4 rounded-full tracking-wide
                        font-semibold focus:outline-none hover:bg-green_2 shadow-lg cursor-pointer transition ease-in duration-300" 
                        type="submit">
                        {status === "loading" ? (<PulseLoader color="#fff" size={16} />) : "Sign up"}
                    </button>

                    <p className="flex flex-col items-center justify-center mt-10 text-center text-md dark:text-dark_text_1">
                        <span>Have an account ?</span>
                        <Link to="/login" className="hover:underline cursor-pointer transition ease-in duration-300">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}