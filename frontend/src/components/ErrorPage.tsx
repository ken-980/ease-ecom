import {  ErrorResponse, useRouteError } from "react-router"


export const ErrorPage = () => {
    const error  = useRouteError() as ErrorResponse;
    
    return (
        <div className="flex justify-center items-center">
            <div>
                <h1>Oops</h1>
                <p className="text-red-500"> {error.status} </p>
                <p className="text-red-500"> {error.statusText} </p>
                <p className="text-red-500"> {error.data} </p>
            </div>
        </div>
    )
}