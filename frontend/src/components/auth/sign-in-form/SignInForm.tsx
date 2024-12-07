import { SignedOut, SignIn } from "@clerk/clerk-react";

const SignInForm = () => {

    return(
        <>
            <div className="flex items-center h-screen space-x-1">
                <div className="h-full w-full flex justify-center items-center">
                    <SignedOut>
                        <SignIn />
                    </SignedOut>
                </div>
            </div>
        </>
    )
}

export default SignInForm;