import BottomWarning from "../components/BottomWarning";
import Button from "../components/Button";
import Heading from "../components/Heading";
import Inputbox from "../components/Inputbox";
import Subheading from "../components/Subheading";

export const Signup = () => {
  return (
    <div className="bg-slate-300 h-screen flex justify-center items-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-4 max-w-sm">
          <Heading label={"Sign up"} />
          <Subheading label={"Enter your information to create an account"} />

          <Inpubox placeholder="John" label="First Name" />
          <Inputbox placeholder="Doe" label="Last Name" />
          <Inputbox placeholder="harkirat@gmail.com" label="Email" />
          <Inputbox placeholder="123456" label="Password" />

          <div className="pt-4">
            <Button label="Sign up" />
          </div>
        </div>

        <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} />
      </div>
    </div>
  );
};

export default Signup;
