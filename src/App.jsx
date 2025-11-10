import AppRoutes from "./routes/AppRoutes"
import { AppDialogProvider } from "./context/AppDialogContext";
import './App.css'; 


function App() {
    return (
        <>
            <AppDialogProvider>
                <AppRoutes />
            </AppDialogProvider>
        </>
    );
}

export default App;