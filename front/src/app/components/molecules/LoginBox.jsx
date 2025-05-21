import Title from '../atoms/Title';
import AuthButton from '../atoms/AuthButton';
import PanelBox from '../atoms/PanelBox';

const LoginBox = ({ onLogin }) => (
  <PanelBox>
    <Title>Autentiqueu-vos utilitzant el vostre compte a:</Title>
    <AuthButton onClick={onLogin} />
  </PanelBox>
);

export default LoginBox;
