  import GoogleIcon from './GoogleIcon';

const AuthButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="bg-white text-black font-semibold py-3 w-full rounded-lg flex items-center justify-center"
  >
    <GoogleIcon />
    Google / @inspedralbes.cat
  </button>
);
export default AuthButton;
