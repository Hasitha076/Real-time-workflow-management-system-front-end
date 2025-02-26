import React from 'react'
import styled from 'styled-components'
import LoginContent from './components/LoginContent'
import SignIn from '../../components/SignIn'
import SignUp from '../../components/SignUp'

const Body = styled.div`
    background: #13111C;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow-x: hidden;
`

const Container = styled.div`
    height: 100vh;
    width: 100%;
    background-Image: linear-gradient(38.73deg, rgba(204, 0, 187, 0.25) 0%, rgba(201, 32, 184, 0) 50%), linear-gradient(141.27deg, rgba(0, 70, 209, 0) 50%, rgba(0, 70, 209, 0.25) 100%);    
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const Top = styled.div`
width: 100%;
display: flex;
padding-bottom: 50px;
flex-direction: column;
align-items: center;
background: linear-gradient(38.73deg, rgba(204, 0, 187, 0.15) 0%, rgba(201, 32, 184, 0) 50%), linear-gradient(141.27deg, rgba(0, 70, 209, 0) 50%, rgba(0, 70, 209, 0.15) 100%);
clip-path: polygon(0 0, 100% 0, 100% 100%,50% 95%, 0 100%);
@media (max-width: 768px) {
    clip-path: polygon(0 0, 100% 0, 100% 100%,50% 98%, 0 100%);
    padding-bottom: 0px;
}
`;
const Content = styled.div`
    width: 100%;
    height: 100%;
    background: #13111C;
    display: flex;
    flex-direction: column;
`

const Home = () => {
    const [SignInOpen, setSignInOpen] = React.useState(false);
    const [SignUpOpen, setSignUpOpen] = React.useState(false);

    return (
        <Body>
            <Container>
                <Top>
                    <LoginContent setSignInOpen={setSignInOpen} setSignUpOpen={setSignUpOpen} />
                </Top>
                {SignInOpen && (
                    <SignIn SignInOpen={SignInOpen} setSignInOpen={setSignInOpen} setSignUpOpen={setSignUpOpen} />
                )}

                {SignUpOpen && (
                    <SignUp SignUpOpen={SignUpOpen}  setSignUpOpen={setSignUpOpen} setSignInOpen={setSignInOpen} />
                )}
            </Container>
        </Body>
    )
}

export default Home