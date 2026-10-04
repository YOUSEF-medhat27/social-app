
import { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { authcontext } from '../../Context/AuthContext'

export default function Navbar() {


    let { token ,LogoutContext } = useContext(authcontext)


    let navigate = useNavigate()
    function LOgout(){
        LogoutContext()
        navigate("/Login")
    }
    return <>

        <div className="sticky top-0 z-50 px-4 pt-4">

    <nav className="container mx-auto">

        <div className="bg-white/80 backdrop-blur-lg border border-blue-100 shadow-lg rounded-2xl">

            <div className="w-[90%] md:w-[80%] mx-auto py-4">

                <ul className="flex justify-center md:justify-between items-center gap-6 text-gray-700 font-medium">

                    {token ? (
                        <>

                            <li>
                                <NavLink
                                    to="/home"
                                    className={({ isActive }) =>
                                        `px-4 py-2 rounded-lg transition-all duration-300 ${
                                            isActive
                                                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                                : "hover:bg-blue-50 hover:text-blue-600"
                                        }`
                                    }
                                >
                                    Home
                                </NavLink>
                            </li>


                            <li>
                                <NavLink
                                    to="/profile"
                                    className={({ isActive }) =>
                                        `px-4 py-2 rounded-lg transition-all duration-300 ${
                                            isActive
                                                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                                : "hover:bg-blue-50 hover:text-blue-600"
                                        }`
                                    }
                                >
                                    Profile
                                </NavLink>
                            </li>


                            <li>
                                <button
                                    onClick={LOgout}
                                    className="px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
                                >
                                    Logout
                                </button>
                            </li>

                        </>
                    ) : (
                        <>

                            <li>
                                <NavLink
                                    to="/Login"
                                    className={({ isActive }) =>
                                        `px-5 py-2 rounded-lg transition-all duration-300 ${
                                            isActive
                                                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                                : "hover:bg-blue-50 hover:text-blue-600"
                                        }`
                                    }
                                >
                                    Login
                                </NavLink>
                            </li>


                            <li>
                                <NavLink
                                    to="/Register"
                                    className={({ isActive }) =>
                                        `px-5 py-2 rounded-lg transition-all duration-300 ${
                                            isActive
                                                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                                : "hover:bg-blue-50 hover:text-blue-600"
                                        }`
                                    }
                                >
                                    Register
                                </NavLink>
                            </li>

                        </>
                    )}

                </ul>

            </div>

        </div>

    </nav>

</div>

    </>
}
