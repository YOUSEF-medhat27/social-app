import { Button, Input, Typography } from "@heroui/react";
import Navbar from "../Navbar/Navbar";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { authcontext } from "./../../Context/AuthContext"
export default function Login() {


    let { insertusertoken } = useContext(authcontext)

    const [isloading, setisloading] = useState(false)
    let navigate = useNavigate()

    let schema = z.object({
        email: z.email("invalid email"),
        password: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "Password: 8+ characters, including uppercase, lowercase, number & special character."),
    })

    let { register, handleSubmit, formState: { touchedFields, errors } } = useForm({
        defaultValues: {
            email: "",
            password: "",

        },
        resolver: zodResolver(schema)
    })



    async function signin(values) {
        setisloading(true)
        try {

            let { data } = await axios.post("https://route-posts.routemisr.com/users/signin", values, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            
            setisloading(false)
            toast.success('done')
            navigate("/home")
            insertusertoken(data.data.token)
            localStorage.setItem("token", data.data.token)

        } catch (error) {
            console.log(error.response?.data);
            setisloading(false)
            toast.error(error.response?.data?.message)

        }
    }

    return <>

        <Navbar />

        <div className="my-12 ">
            {console.log(errors)}
            <Typography className=" my-12 text-blue-700 " align="center" type="h1">login Now</Typography>
            <form onSubmit={handleSubmit(signin)} className="w-[60%] p-10 shadow-2xl mx-auto" >

                {/* {email} */}
                <Input id="email" {...register("email")} type="email" fullWidth placeholder="Enter Your Email" variant="secondary" className="mb-4" />
                {touchedFields?.email && errors?.email && <p className="mb-5 text-danger ">{errors.email?.message}</p>}

                {/* {password} */}
                <Input id="password" {...register("password")} type="password" fullWidth placeholder="Enter Your Password" variant="secondary" className="mb-4" />
                {touchedFields?.password && errors?.password && <p className="mb-5 text-danger ">{errors.password?.message}</p>}



                <Button type="submit" className="my-5" fullWidth={true}>{isloading ? <i className="fa-solid fa-spinner fa-spin text-white"></i> : "Register"}</Button>


            </form>

        </div>




    </>
}
