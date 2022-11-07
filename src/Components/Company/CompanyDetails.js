import React from 'react';
import withRouter from '../withRouter';
import { Typography, PageHeader, Descriptions, Avatar, Row, Col } from 'antd';
import { Button } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';

class CompanyDetails extends React.Component {

    constructor(props) {
        super(props)
        this.id = this.props.params.id;
        this.state = {
          company : {}
        }
        this.getCompanyDetails();
    }

    getCompanyDetails = async () => {
      console.log(this.id);
      const { data, error } = await this.props.supabase
        .from('company')
        .select()
        .eq('id', this.id )

      if ( error == null && data.length > 0){
        // Data is a list
        this.setState({
          company : data[0]
        }) 
      }
    }


    render() { 
      const { Text } = Typography;
      let letter = "";
      if (this.state.company.name != undefined){
        letter=this.state.company.name.charAt(0);
      }
      return (
        <Row justify="center">
        <Col xs={24} sm={24} md={18} lg={16} xl={14}>
        <PageHeader title={ this.state.company.title } 
            ghost={false} onBack={() => window.history.back()}>
          <Row>
            <Col xs={8} sm={6} md={6} lg={6} xl={4}>
              <Avatar style={{ backgroundColor: "#FECBC1", color:"#000000" , marginTop: 12  }} size={100} >
                { letter }
              </Avatar>
            </Col>
            <Col xs={16} sm={18} md={18} lg={18} xl={20}>
              <Descriptions title={ this.state.company.name }>
                <Descriptions.Item label="" span={3}>{ this.state.company.description }</Descriptions.Item>
                <Descriptions.Item label="Address" span={2}>{ this.state.company.adress }</Descriptions.Item>
                <Descriptions.Item label="Employees">{ this.state.company.employees }</Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </PageHeader>
        </Col>
        </Row>
      )
    }
  }

  export default withRouter(CompanyDetails);