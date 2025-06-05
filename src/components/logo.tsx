import React from 'react';

const Logo: React.FC = () => {
    return (
        <div className="mb-16 flex flex-col items-center">
            <img src="/logo.png" alt="logo"  />
            <h1 className="text-3xl font-bold text-gray-800">PotatoGuard</h1>
        </div>
    );
};

export default Logo;