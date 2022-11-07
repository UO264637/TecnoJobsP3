import React from 'react';
import withRouter from '../withRouter';
import { Typography, PageHeader, Descriptions, Tag, Col, Row } from 'antd';
import { Link } from "react-router-dom"
import { Button } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';

class OfferDetails extends React.Component {

    constructor(props) {
        super(props)
        this.id = this.props.params.id;
        this.state = {
          offer: {},
          skills: []
        }
        this.getOfferDetails();
        this.increaseVisits();
    }

    getOfferDetails = async () => {
      const { data, error } = await this.props.supabase
        .from('offer')
        .select('*, company(id, name)')
        .eq('id', this.id )

      if ( error == null && data.length > 0){
        data[0].companyName = data[0].company.name;
        data[0].companyId = data[0].company.id;
        delete data[0].company;
      
        this.setState({
          offer : data[0]
        }) 

        const { data:data1, error1 } = await this.props.supabase
        .from('skills_by_offer')
        .select('*')
        .eq('offer_id', this.id )
                   

        if ( error1 == null ){
          this.setState({
            skills : data1
          }) 
        }
        else{
          console.log(error)
        }
      }
    }

    increaseVisits = async () => {
      const { data, error } = await this.props.supabase
        .from('offer')
        .select('visits')
        .eq('id', this.id )

      if (error == null) {
        await this.props.supabase
        .from('offer')
        .update({ 
          visits: data[0].visits+1
        })
        .eq('id', this.id)
        .select()
      }
    }

    render() { 
      const { Text } = Typography;
      return (
        <Row justify="center">
        <Col xs={24} sm={24} md={18} lg={16} xl={14}>
        <PageHeader title={ this.state.offer.title } 
            ghost={false} onBack={() => window.history.back()}>
          <Descriptions>
            <Descriptions.Item span={3}>{ this.state.offer.description }</Descriptions.Item>
            <Descriptions.Item label="Company"><Link to={"/company/"+this.state.offer.companyId}>{ this.state.offer.companyName }</Link></Descriptions.Item>
            <Descriptions.Item label="Workday">
              <Text strong>{ this.state.offer.workday }</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Location">
              <Text strong>{ this.state.offer.location }</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Skills" span={2}>
              { this.state.skills.map(skill => 
              <Tag color={skill.color}>
                {skill.name}
              </Tag>) }
            </Descriptions.Item>
            <Descriptions.Item span={1} label="Salary" contentStyle={{textAlign: "left"}}>
            <Text strong style={{ fontSize:'1rem'}}>{ this.state.offer.salary + "€" }</Text>
            </Descriptions.Item>
          </Descriptions>
        </PageHeader>
        </Col>
        </Row>
      )
    }
  }

  export default withRouter(OfferDetails);