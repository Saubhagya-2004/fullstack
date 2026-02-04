import { useState } from "react";

export default function LoginModal({ onLogin }) {
    const [name, setName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onLogin(name.trim());
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full transform transition-all scale-100 animate-fade-in text-center">
                <div className="mb-6">
                    <span className="text-5xl">👋</span>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Auction!</h2>
                <p className="text-gray-500 mb-6">Enter your name to start bidding</p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all mb-4"
                        placeholder="Your Name (e.g., Alice)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] shadow-md"
                    >
                        Join Auction 🚀
                    </button>
                </form>
            </div>
        </div>
    );
}
