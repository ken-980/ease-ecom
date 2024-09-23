import { Form, Link, useActionData, useNavigation } from 'react-router-dom';
import { LoadAnimationCircle } from '../../common/LoadAnimation';


const AdminAuth = () => {



    const actionData = useActionData();
    const navigation = useNavigation();


    const load = (navigation.state === "submitting") ? true : false;
    return (
        <div className={`flex justify-center items-center h-screen p-4`}>

            <Form className='p-3 border border-slate-400 space-y-3' method='post'>
                <h2 className='text-xl text-center text-slate-700 font-plus-font'> Sign into your Account </h2>
                <div>
                    <label htmlFor="admin_user_name">
                        <span className="block font-plus-font text-sm font-medium text-slate-700">Username</span>
                        <input type="text" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300s text-sm shadow-sm placeholder-slate-400
                        focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" name="username" id="admin_user_name" disabled={load}  placeholder='User name'/>
                    </label>
                </div>

                <div>
                    <label htmlFor="admin_password">
                        <span className="block text-sm font-plus-font font-medium text-slate-700"> Password </span>
                        <input className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 text-sm shadow-sm placeholder-slate-400
                        focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" type="password" name="password" id="admin_password" disabled={load} placeholder='Password'/>
                    </label>
                </div>

                <button className='w-full p-2 text-center font-bold text-white  font-plus-font transition border-0 bg-green-500 hover:bg-green-400' disabled={load} type='submit'> { load ? <LoadAnimationCircle /> : "Sign in" }  </button>

                <span className="text-red-500 text-xs font-plus-font "> {typeof actionData === "string" && actionData} </span>


                <div>
                    <Link className='text-sky-400 hover:text-sky-300 font-plus-font transition' to={"/admin/register"}> Register an account </Link>
                </div>
            </Form>
        </div>
    )
}

export default AdminAuth;