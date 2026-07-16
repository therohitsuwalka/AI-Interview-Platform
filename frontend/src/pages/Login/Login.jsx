import AuthBanner from "../../components/Auth/AuthBanner";
import LoginForm from "../../components/Auth/LoginForm";

function Login() {
  return (

    <div className="grid lg:grid-cols-2 min-h-screen">

      <AuthBanner/>

      <LoginForm/>

    </div>

  );
}

export default Login;