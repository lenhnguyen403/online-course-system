import { Navigate, useLocation } from 'react-router-dom'
import { getToken } from '../store/storage'

export default function ProtectedRoute({ children }) {
    const location = useLocation()
    if (!getToken()) {
        return <Navigate to="/" state={{ from: location }} replace />
    }
    return children
}
