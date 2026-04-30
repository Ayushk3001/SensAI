const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-start justify-center px-4 pb-16 pt-24 sm:pt-32">
      {children}
    </div>
  );
};

export default AuthLayout;
