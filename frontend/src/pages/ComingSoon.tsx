import React from 'react';

interface ComingSoonProps {
    title: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title }) => {
    return (
        <div className="app-container">
            <header className="header">
                <h2>{title}</h2>
                <p>Mô-đun này đang được phát triển. Vui lòng quay lại sau!</p>
            </header>
            <div className="flex justify-center mt-12 pb-24">
                <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center animate-pulse">
                     <span className="material-symbols-outlined text-4xl text-primary">construction</span>
                </div>
            </div>
        </div>
    );
};

export default ComingSoon;
