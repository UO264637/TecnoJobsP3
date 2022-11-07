import React from 'react';
import { Button, InputNumber, Form, Input, Steps, Divider } from 'antd';
import { Card, Tag, Row, Col } from 'antd';
import { Result  } from 'antd';

class OfferCreateForm extends React.Component {

  constructor(props) {
    super(props);

    this.values = {};
    this.state = {
      createdOffer: false,
      skills: [],
      offerSkills: [],
      current: 0,
    };
    this.getSkills()
  }

  getSkills = async () => {
    const { data, error } = await this.props.supabase
      .from('skill')
      .select('*')

    if ( error == null){
      this.setState({
        skills : data
      }) 
    }
  }

  addSkill = async (skill) => {
    let mySkills = this.state.offerSkills;
    if (!mySkills.includes(skill))
    {
      mySkills.push(skill);
    }

    this.setState({
      offerSkills : mySkills
    }) 
  }

  removeSkill = async (skill) => {
    let mySkills = this.state.offerSkills;
    const index = mySkills.indexOf(skill);
    if (index > -1) { 
      mySkills.splice(index, 1);
    }

    this.setState({
      offerSkills : mySkills
    }) 
  }

  step1Values = (values) => {
    this.values.title = values.title;
    this.values.salary = values.salary;
    this.values.workday = values.workday;
    this.values.location = values.location;
  }

  step2Values = (values) => {
    this.values.description = values.description;
    console.log(this.values)
  }

  async sendCreateOffer(){

    const { data: { user } } = await this.props.supabase.auth.getUser();

    if (user != null){
      const { data: data1, error: error1 } = await this.props.supabase
          .from('company')
          .select('*')
          .eq('user', user.email )
  
      if (error1 == null){
        const { data, error } = await this.props.supabase
          .from('offer')
          .insert([
          { 
            title: this.values.title, 
            description: this.values.description, 
            salary: this.values.salary,
            workday: this.values.workday,
            location: this.values.location,
            company_id: data1[0].id,
          }])
          .select()

        if (error != null){
          console.log(error);
        } else {
          for (let i=0; i < this.state.offerSkills.length; i++) 
          {
            const { data2, error } = await this.props.supabase
              .from('offer_skill')
              .insert([
              { 
                offer_id: data[0].id,
                skill_id: this.state.offerSkills[i].id
              }])
            console.log(error)
          }
          
          this.setState({
            createdOffer : true
          }) 
        }
      }
    }
  }

  next = () => {
    this.setState({
      current : this.state.current+1
    }) 
  };
  prev = () => {
    this.setState({
      current : this.state.current-1
    })
  };

  render() {
    let space = " ";
    let steps = [
      {
        title: 'Basic data',
        content: <Form name="basic" labelCol={ {span: 24/3} } wrapperCol={{ span: 24/3}} 
        size="Large"
        onFinish={ values => {this.next(); this.step1Values(values)} } autoComplete="off">

        <Form.Item label="Title" name="title"
          rules={[ 
            { required: true,message: 'Please input a title!',},
            { max: 25, message: 'title must be maximum 25 characters.' },
          ]}>
          <Input placeholder="Offer title"/>
        </Form.Item>

        <Form.Item label="Salary"  name="salary"
          rules={[
            { required: true, message: 'Please input a salary!', },
          ]}>
           <InputNumber prefix="€" min={0} placeholder="30000"/>
        </Form.Item>

        <Form.Item label="Workday"  name="workday"
          rules={[
            { required: true, message: 'Please input a workday!', },
            { max: 25, message: 'workday must be maximum 25 characters.' },
          ]}>
          <Input placeholder="Full time"/>
        </Form.Item>

        <Form.Item label="Location"  name="location"
          rules={[
            { required: true, message: 'Please input a location!', },
            { max: 25, message: 'location must be maximum 25 characters.' },
          ]}>
          <Input placeholder="City"/>
        </Form.Item>

        <Form.Item wrapperCol={{  xs: { offset: 0 }, sm: { offset: 8, span: 24/3 } }} >
          <Button type="primary" htmlType="submit"  block>Next</Button>
        </Form.Item>
      </Form>,
      },
      {
        title: 'Description',
        content: <Form name="basic" labelCol={ {span: 24/3} } wrapperCol={{ span: 10}}
        size="Large"
        onFinish={ values => {this.next(); this.step2Values(values)} } autoComplete="off">

        <Form.Item label="Description"  name="description"
          rules={[
            { required: true, message: 'Please input a description!', },
            { max: 250, message: 'description must be maximum 250 characters.' },
          ]}>
          <Input.TextArea showCount  style={{ height: 200 }}  placeholder="Offer description"/>
        </Form.Item>
        
        <Form.Item wrapperCol={{  xs: { offset: 0 }, sm: { offset: 8, span: 10 } }} >
          <Row gutter={16}>
          <Col span={10}>
          <Button style={{ margin: '0 8px' }} onClick={() => this.prev()}  block>Back</Button>
          </Col>
          <Col span={10}>
          <Button type="primary" htmlType="submit" wrapperCol={{  span: 24/2  }} block>Next</Button>
          </Col>
          </Row>
        </Form.Item>
        
      </Form>,
      },
      {
        title: 'Skills',
        content: <Form name="basic" labelCol={ {span: 24/3} } wrapperCol={{ span: 24/2}} 
        size="Large"
        onFinish={ values => this.sendCreateOffer(values) } autoComplete="off">

        <Form.Item label="Skills"  name="skills">
          <pre>{space}
            { this.state.offerSkills.map( skill => {
              return (
                <Tag color={skill.color} closable onClose={() => this.removeSkill(skill)}>
                  {skill.name}
                </Tag>) }
              )
            }
          </pre>
            
          <div>
            { this.state.skills.map( skill => {
              return (
                <Button type="primary" shape="round" size="small" key={skill.id} onClick={() => this.addSkill(skill)}
                style={{ background: skill.color, borderColor: skill.color}}>{skill.name}</Button>
              )
            })}
          </div>
        </Form.Item>
        
        <Form.Item wrapperCol={{  xs: { offset: 0 }, sm: { offset: 8, span: 24/3 } }} >
        <Row gutter={16}>
          <Col span={10}>
          <Button style={{ margin: '0 8px' }} onClick={() => this.prev()}  block>Back</Button>
          </Col>
          <Col span={10}>
          <Button type="primary" htmlType="submit" wrapperCol={{  span: 24/2  }} block>Next</Button>
          </Col>
          </Row>
        </Form.Item>
      </Form>,
      },
    ];

    if (this.state.createdOffer){
      return ( 
        <Result
        status="success" title="Offer Created"
        subTitle="Your offer is ready for everyone."
        extra={[
          <Button type="primary" key="myOffersButton" href={"/userOffers"}>
            Go to my offers
          </Button>,
          <Button key="createOfferButton" href={"/offer/create"}>Create another offer</Button>,
        ]}
      />)
    }

    return (
      <Row justify="center">
      <Col xs={24} sm={24} md={18} lg={16} xl={14}>
      <Card>
      <Steps current={this.state.current}>
        <Steps.Step title="Basic Information"/>
        <Steps.Step title="Description"/>
        <Steps.Step title="Skills"/>
      </Steps>
      <Divider/>
      <div className="steps-content">{steps[this.state.current].content}</div>
      </Card>
      </Col>
      </Row>
    )
  }
}

  export default OfferCreateForm;

/*
import React from 'react';
import { Button, InputNumber, Form, Input } from 'antd';
import { Card, Tag, Row, Col } from 'antd';
import { Result  } from 'antd';

class OfferCreateForm extends React.Component {

  constructor(props) {
    super(props)
    this.file = null
    this.state = {
      createdOffer: false,
      skills: [],
      offerSkills: [],
    };
    this.getSkills()
  }

  getSkills = async () => {
    const { data, error } = await this.props.supabase
      .from('skill')
      .select('*')

    if ( error == null){
      this.setState({
        skills : data
      }) 
    }
  }

  addSkill = async (skill) => {
    let mySkills = this.state.offerSkills;
    if (!mySkills.includes(skill))
    {
      mySkills.push(skill);
    }

    this.setState({
      offerSkills : mySkills
    }) 
  }

  removeSkill = async (skill) => {
    let mySkills = this.state.offerSkills;
    const index = mySkills.indexOf(skill);
    if (index > -1) { 
      mySkills.splice(index, 1);
    }

    this.setState({
      offerSkills : mySkills
    }) 
  }

  async sendCreateOffer(values){

    const { data: { user } } = await this.props.supabase.auth.getUser();
  
    if (user != null){
      const { data, error } = await this.props.supabase
        .from('offer')
        .insert([
        { 
          title: values.title, 
          description: values.description, 
          salary: values.salary,
          workday: values.workday,
          location: values.location,
          company_id: "1",
        }])
        .select()

      if (error != null){
        console.log(error);
      } else {
        for (let i=0; i < this.state.offerSkills.length; i++) 
        {
          const { data2, error } = await this.props.supabase
            .from('offer_skill')
            .insert([
            { 
              offer_id: data[0].id,
              skill_id: this.state.offerSkills[i].id
            }])
          console.log(error)
        }
        
        this.setState({
          createdOffer : true
        }) 
      }
    }
  }

  render() {
    if (this.state.createdOffer){
      return ( 
        <Result
        status="success" title="Offer Created"
        subTitle="Your offer is ready for everyone."
        extra={[
          <Button type="primary" key="myOffersButton" href={"/userOffers"}>
            Go to my offers
          </Button>,
          <Button key="createOfferButton" href={"/offer/create"}>Create another offer</Button>,
        ]}
      />)
    }

    let space = " ";
    return (
      <Row justify="center">
      <Col xs={24} sm={24} md={18} lg={16} xl={14}>
      <Card>
        <Form name="basic" labelCol={ {span: 24/3} } wrapperCol={{ span: 24/3}} 
          size="Large"
          onFinish={ values => this.sendCreateOffer(values) } autoComplete="off">

          <Form.Item label="Title" name="title"
            rules={[ 
              { required: true,message: 'Please input a title!',},
              { max: 25, message: 'title must be maximum 25 characters.' },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item label="Description"  name="description"
            rules={[
              { required: true, message: 'Please input a description!', },
              { max: 250, message: 'description must be maximum 250 characters.' },
            ]}>
            <Input.TextArea />
          </Form.Item>

          <Form.Item label="Salary"  name="salary"
            rules={[
              { required: true, message: 'Please input a salary!', },
            ]}>
             <InputNumber prefix="€" min={0} />
          </Form.Item>

          <Form.Item label="Workday"  name="workday"
            rules={[
              { required: true, message: 'Please input a workday!', },
              { max: 25, message: 'workday must be maximum 25 characters.' },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item label="Location"  name="location"
            rules={[
              { required: true, message: 'Please input a location!', },
              { max: 25, message: 'location must be maximum 25 characters.' },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item label="Skills"  name="skills">
            <pre>{space}
              { this.state.offerSkills.map( skill => {
                return (
                  <Tag color={skill.color} closable onClose={() => this.removeSkill(skill)}>
                    {skill.name}
                  </Tag>) }
                )
              }
            </pre>
              
            <div>
              { this.state.skills.map( skill => {
                return (
                  <Button type="primary" shape="round" size="small" key={skill.id} onClick={() => this.addSkill(skill)}
                  style={{ background: skill.color, borderColor: skill.color}}>{skill.name}</Button>
                )
              })}
            </div>
          </Form.Item>
          
          <Form.Item wrapperCol={{  xs: { offset: 0 }, sm: { offset: 8, span: 24/3 } }} >
            <Button type="primary" htmlType="submit"  block>Offer Job</Button>
          </Form.Item>
        </Form>
      </Card>
      </Col>
      </Row>
    )
  }
}

  export default OfferCreateForm;
*/