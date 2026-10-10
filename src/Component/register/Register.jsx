import { Button, Input, Typography } from "@heroui/react";
import Navbar from "../Navbar/Navbar";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [isloading, setisloading] = useState(false)
    let navigate = useNavigate()

    let schema = z.object({
        name: z.string().min(4, "min is 4").max(15, "max is 15"),
        username: z.string().regex(/^[a-z0-9_]{3,30}$/, "min length is 3 max length is 30"),
        email: z.email("invalid email"),
        dateOfBirth: z.coerce.date().refine(function (value) {
            let year = new Date().getFullYear()
            let newyear = value.getFullYear()
            if (year - newyear >= 18) {
                return true
            }
            return false
        }),
        gender: z.enum(["male", "female"], "male or female"),
        password: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "Password: 8+ characters, including uppercase, lowercase, number & special character."),
        rePassword: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "rePassword: 8+ characters, including uppercase, lowercase, number & special character.")
    }).refine(function (values) {
        if (values.password == values.rePassword) {
            return true
        }
        return false
    }, { message: "repassword must be the same of password", path: ["rePassword"] })

    let { register, handleSubmit, formState: { touchedFields, errors } } = useForm({
        defaultValues: {
            name: "",
            username: "",
            email: "",
            dateOfBirth: "",
            gender: "",
            password: "",
            rePassword: ""
        },
        resolver: zodResolver(schema)
    })



    async function signup(values) {
        setisloading(true)
        try {

            let { data } = await axios.post("https://route-posts.routemisr.com/users/signup", values, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            console.log(data);
            localStorage.setItem("Name", values.name)
            localStorage.setItem("username", values.username)
            setisloading(false)
            toast.success('done')
            navigate("/Login")

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
            <Typography className=" my-12 text-blue-700 " align="center" type="h1">Register Now</Typography>
            <form onSubmit={handleSubmit(signup)} className="w-[60%] p-10 shadow-2xl mx-auto" >

                {/* {name} */}
                <Input id="name" {...register("name")} type="text" fullWidth placeholder="Enter Your Name" variant="secondary" className="mb-4" />
                {touchedFields?.name && errors?.name && <p className="mb-5 text-danger ">{errors.name?.message}</p>}
                {/* {username} */}
                <Input id="username" {...register("username")} type="text" fullWidth placeholder="Enter Your UserName" variant="secondary" className="mb-4" />
                {touchedFields?.username && errors?.username && <p className="mb-5 text-danger ">{errors.username?.message}</p>}
                {/* {email} */}
                <Input id="email" {...register("email")} type="email" fullWidth placeholder="Enter Your Email" variant="secondary" className="mb-4" />
                {touchedFields?.email && errors?.email && <p className="mb-5 text-danger ">{errors.email?.message}</p>}

                {/* {password} */}
                <Input id="password" {...register("password")} type="password" fullWidth placeholder="Enter Your Password" variant="secondary" className="mb-4" />
                {touchedFields?.password && errors?.password && <p className="mb-5 text-danger ">{errors.password?.message}</p>}

                {/* {rePassword} */}
                <Input id="rePassword" {...register("rePassword")} type="password" fullWidth placeholder="Enter Your RePassword" variant="secondary" className="mb-4" />
                {touchedFields?.rePassword && errors?.rePassword && <p className="mb-5 text-danger ">{errors.rePassword?.message}</p>}

                {/* {dateOfBirth} */}
                <Input id="dateOfBirth" {...register("dateOfBirth")} type="date" fullWidth placeholder="Enter Your DateofBirth" variant="secondary" className="mb-4" />
                {touchedFields?.dateOfBirth && errors?.dateOfBirth && <p className="mb-5 text-danger ">{errors.dateOfBirth?.message}</p>}

                {/* {gender} */}
                <div className="flex items-center gap-4 mb-4">

                    <label htmlFor="male">
                        <input
                            type="radio"
                            id="male"
                            value="male"
                            {...register("gender")}
                        />
                        <span className="ms-2">Male</span>
                    </label>

                    <label htmlFor="female">
                        <input
                            type="radio"
                            id="female"
                            value="female"
                            {...register("gender")}
                        />
                        <span className="ms-2">Female</span>
                    </label>

                </div>

                {touchedFields?.gender && errors?.gender &&
                    <p className="mb-5 text-danger">
                        {errors.gender?.message}
                    </p>
                }

                <Button type="submit" className="my-5" fullWidth={true}>{isloading ? <i className="fa-solid fa-spinner fa-spin text-white"></i> : "Register"}</Button>


            </form>

        </div>




    </>
}
