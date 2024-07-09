const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return <div className="flex flex-col justify-center items-center w-full min-h-screen">{children}</div>;
};

export default AuthLayout