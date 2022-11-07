import React from 'react';
import LoginForm from './Components/LoginForm';
import CompaniesList from './Components/Company/CompaniesList';
import CompanyDetails from './Components/Company/CompanyDetails';
import OfferDetails from './Components/Offer/OfferDetails';
import CompanyEditForm from './Components/Company/CompanyEditForm';
import OfferCreateForm from './Components/Offer/OfferCreateForm';
import MyOffersTable from './Components/Offer/MyOffersTable';
import OfferEditForm from './Components/Offer/OfferEditForm';
import OfferList from './Components/Offer/OfferList';
import withRouter from './Components/withRouter';
import SignupForm from './Components/SingupForm';
import { createClient } from '@supabase/supabase-js'
import { Route, Routes, Link, Navigate } from "react-router-dom"
import { Layout, Menu, Image} from 'antd';
import { Col, Row } from 'antd';
import { Avatar, Typography  } from 'antd';
import { FireOutlined , LoginOutlined, FormOutlined, FileAddOutlined, ContainerOutlined   } from '@ant-design/icons';
import logo from "./logo.png";

class App extends React.Component {

    constructor(props) {
      super(props)
  
      // opcional para poder personalizar diferentes aspectos
      const options = {
        schema: 'public',
        headers: { 'x-my-custom-header': 'my-app-name' },
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    
      const supabase = createClient(
        'https://feogfnusftjnqyppnpau.supabase.co', 
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlb2dmbnVzZnRqbnF5cHBucGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjY4Nzg1NzEsImV4cCI6MTk4MjQ1NDU3MX0.RLUSu4Bdf4RdSxfbi-Z1x6SPivzHVOXACNhoUqHRhDw',
        options
      )
    
      this.supabase = supabase;

      // Configuración Inicial del estado
      this.state = {
        user : null
      }
    }

    componentDidMount = async () => {
      if ( this.state.user == null){
        const { data: { user } } = await this.supabase.auth.getUser();

        if ( user != null ){
          this.setState({
            user : user
          })
        }
      }
    }

    callBackOnFinishLoginForm = async (loginUser) => {
        // logIn
        const { data, error } = await this.supabase.auth.signInWithPassword({
        email: loginUser.email,
        password: loginUser.password,
      })
      
      if ( error == null && data.user != null ){
        this.setState({
          user : data.user
        })

        this.props.navigate("/userItems");
      }  
    }

  callBackOnFinishSignupForm = async (loginUser) => {
      // signUp, Create user
      const { data, error } = await this.supabase.auth.signUp({
      email: loginUser.email,
      password: loginUser.password,
    })

    if ( error == null && data.user != null ){
      console.log("a");
      const { data, error } = await this.supabase
        .from('company')
        .insert([
          { 
            name: loginUser.name,
            adress: loginUser.adress,
            description: loginUser.description,
            user: loginUser.email
          }
        ])

        if (error != null){
          console.log(error);
        } else {
          this.setState({
            createdCompany : true
          }) 
        }  
    }
  }
  

    protectedRoute = (element) => {
      if (this.state.user == null) {
        return <Navigate to={"/"} replace />;
      }
      return element;
    };  

  render() {
    // for not using Layout.Header, Layout.Footer, etc...
    const { Header, Footer, Sider, Content } = Layout;
    const { Text } = Typography;

    let contentLeft = <Text style={{ color:"#ffffff" }}>Login</Text>
    if ( this.state.user != null ){
      contentLeft = <Col span="12" style={{display: 'flex', flexDirection: 'row-reverse' }}>
                      <Link to="/edit/profile">
                        <Avatar style={{ backgroundColor: "#FECBC1", color:"#000000"   }} size="large" >
                          { this.state.user.email.charAt(0) }
                        </Avatar>
                      </Link>
                    </Col>
    }
    else {
      let rightMenuItems =[
        { key:"menuSignup",  label: <Link to="/signup">Sign up</Link>, icon: <FormOutlined/>},
        { key:"menuLogin",  label: <Link to="/">Login</Link>, icon: <LoginOutlined/>}]

        contentLeft = <Col span="12">
                      <Menu theme="dark" mode="horizontal" items={ rightMenuItems } style={{display: 'flex', flexDirection: 'row-reverse', width: '100%'}}>
                      </Menu>
                    </Col>
    }

    let menuItems = [
      { key:"logo",  label: <Image src={logo} width={55}/>},
      { key:"menuOffers",  label: <Link to="/offers">Offers</Link>, icon: <FireOutlined />},
      { key:"auth_createOffer",  label: <Link to="/offer/create">Offer Job</Link>, icon: <FileAddOutlined/> },
      { key:"auth_userOffers",  label: <Link to="/userOffers">My offers</Link>, icon: <ContainerOutlined  /> },
      ]

    if (this.state.user == null){
      menuItems = menuItems.filter( element => !element.key.startsWith("auth") );
    }

    return (
      <Layout className="layout" >
        <Header style={{
        position: 'fixed',
        zIndex: 1,
        width: '100%',
      }}>
          <Row>
            <Col span="12">
              <Menu theme="dark" mode="horizontal" items={ menuItems } >
              </Menu>
            </Col>
            {contentLeft}
          </Row>
        </Header>
  
        <Content style={{ padding: '0 50px', minHeight: "calc(100vh - 184px)", marginTop: 64, marginBottom: 50}}>
          <div className="site-layout-content">
            <Row style={{ marginTop: 34 }}>
              <Col span={24}>
                <Routes>
                  <Route path="/" element={ 
                    <LoginForm callBackOnFinishLoginForm  = { this.callBackOnFinishLoginForm } /> 
                    } />
                  <Route path="/TecnoJobs" element={ 
                    <OfferList supabase={this.supabase} /> 
                  } />
                  <Route path="/signup" element={ 
                      <SignupForm callBackOnFinishSignupForm = { this.callBackOnFinishSignupForm } /> 
                   } />
                  <Route path="/companies" element={ 
                    <CompaniesList supabase={this.supabase} /> 
                  } />
                  <Route path="/offers" element={ 
                    <OfferList supabase={this.supabase} /> 
                  } />
                  <Route path="/offer/:id" element={ 
                    <OfferDetails supabase={this.supabase}/> 
                  } />
                  <Route path="/company/:id" element={ 
                    <CompanyDetails supabase={this.supabase}/> 
                  } />
                  <Route path="/offer/create" element={ 
                    this.protectedRoute(<OfferCreateForm supabase={this.supabase}/>)
                  } />
                  <Route path="/userOffers" element={ 
                    <MyOffersTable supabase={this.supabase}/> 
                  } />
                  <Route path="/edit/offer/:id" element={ 
                    <OfferEditForm supabase={this.supabase}/> 
                  } />
                  <Route path="/edit/profile" element={ 
                    <CompanyEditForm supabase={this.supabase}/> 
                  } />
                </Routes>
              </Col>
            </Row>
          </div>
        </Content>
          <Footer style={{ color: '#cbd5e1', textAlign: 'center', backgroundColor: '#001529'}}> TecnoJobs </Footer>
      </Layout>
    );
  }
}

export default withRouter(App);
