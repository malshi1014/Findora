import AppRoutes from "./routes/AppRoutes";
import AuroraBackground from "./components/Background/AuroraBackground";

function App() {
  return (
    <>
      <AuroraBackground />
      <div className="relative z-10">
        <AppRoutes />
      </div>
    </>
  );
}

export default App;
