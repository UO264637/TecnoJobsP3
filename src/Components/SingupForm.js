
import React from 'react';
import { Button, Form, Input, InputNumber } from 'antd';
import { Card, Row, Col } from 'antd';

class SignupForm extends React.Component {

  sendSignup(values){
    this.props.callBackOnFinishSignupForm({
      email: values.email,
      password: values.password,
      name: values.name,
      description: values.description,
      adress: values.adress,
      employees: values.employees
    });
  }
  
    render() {
      return (
        <Row justify="center">
        <Col xs={24} sm={24} md={18} lg={16} xl={14}>
        <div style={{height: '100%'}}>
          <Card>
            <Form name="basic" labelCol={{span: 24/4}} wrapperCol={{ span: 24/2}} 
              initialValues={{remember: true,}}
              onFinish={ values => this.sendSignup(values) } autoComplete="off">

              <Form.Item label="Email" name="email"
                rules={[ 
                  { required: true,message: 'Please input your username!',},
                  { max: 25, message: 'email must be maximum 25 characters.' },
                ]}>
                <Input placeholder="example@email.com"/>
              </Form.Item>

              <Form.Item label="Password"  name="password"
                rules={[
                  { required: true, message: 'Please input your password!', },
                  { max: 12, message: 'password must be maximum 12 characters.' },
                  { min: 5, message: 'email must be minimum 5 characters.' },
                ]}>
                <Input.Password />
              </Form.Item>

              <Form.Item label="Name"  name="name"
                rules={[
                  { required: true, message: 'Please input your company name!', },
                  { max: 25, message: 'name must be maximum 25 characters.' },
                ]}>
                <Input placeholder="Company name"/>
              </Form.Item>

              <Form.Item label="Adress"  name="adress"
                rules={[
                  { required: true, message: 'Please input your adress!', },
                  { max: 50, message: 'address must be maximum 25 characters.' },
                ]}>
                <Input placeholder="Street or City"/>
              </Form.Item>

              <Form.Item label="Description"  name="description"
                rules={[
                  { required: true, message: 'Please input your company description!', },
                  { max: 250, message: 'description must be maximum 250 characters.' },
                ]}>
                <Input.TextArea placeholder="Company description"/>
              </Form.Item>

              <Form.Item label="Employees"  name="employees"
                rules={[
                  { required: true, message: 'Please input your company description!', },
                ]}>
                <InputNumber min={0} placeholder="150"/>
              </Form.Item>

              <Form.Item wrapperCol={{  xs: { offset: 0 }, sm: { offset: 6, span: 24/2 } }} >
                <Button type="primary" htmlType="submit" block>Submit</Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
        </Col>
        </Row>
      )
    }
  }

  export default SignupForm;
