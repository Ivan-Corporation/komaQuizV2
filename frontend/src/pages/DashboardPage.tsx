import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div>
        <Link to="/quizzes">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
                Start Quiz
            </button>
        </Link>
        <Link to="/profile">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
                Profile
            </button>
        </Link>
 
    </div>
  )
}
