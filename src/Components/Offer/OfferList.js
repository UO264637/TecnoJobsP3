import React from 'react';
import { Link } from "react-router-dom"
import { Card, Col, Row, Badge, Typography, Divider } from 'antd';
import { Input, AutoComplete, Tag } from 'antd';
import { Slider } from 'antd';
class OfferList extends React.Component {

    constructor(props) {
        super(props);
        this.minSalary = 0;
        this.maxSalary = 80000;
        this.byWord = "";
        this.selectedTags = [];
        this.offers = [];

        this.state = {
          filtered : [],
          skills: [],
          suggestions: []
        }
        this.getOffersSummary();
        this.getSkills();
        this.onSearch("");
    }

    getOffersSummary = async () => {
      const { data, error } = await this.props.supabase
        .from('offer')
        .select('*, company(name)')

      if ( error == null){
        data.map(offer => {offer.companyName = offer.company.name;
          delete offer.company;
          this.state.suggestions.push({value: offer.title})});
        this.offers = data;
        this.setState({
          filtered: data
        })

        const { data: data2, error: error2 } = await this.props.supabase
        .from('skills_by_offer')
        .select('*')
        
        if ( error2 == null){
          this.offers.forEach(offer => {
            offer.skills = [];
            data2.forEach(skill => {
              if (skill.offer_id == offer.id) {
                offer.skills.push(skill.id);
              }
            });
          });
        }
      }
    }

    getSkills = async () => {
      const { data, error } = await this.props.supabase
        .from('skill')
        .select('*')
      
      if ( error == null){
        data.map(skill => {this.state.suggestions.push({value: skill.name})});
        this.offers = data;
        this.setState({
          skills : data
        }) 
      }
    }

    onSearch = async (value) => {
      this.byWord = value.toLowerCase()
      this.filter();
    }

    handleChange = (tag, checked) => {
      let myTags = this.selectedTags;
      if (checked && !myTags.includes(tag))
      {
        myTags.push(tag);
      }
      else if (!checked && myTags.includes(tag)) {
        myTags = myTags.filter(function(item) {
          return item !== tag
      })
      }

      this.selectedTags = myTags;
      this.filter();
    };

    filterBySalary = (interval) => {
      this.minSalary = interval[0]*1000;
      this.maxSalary = interval[1]*1000;
      this.filter();
    };

    filter = () => {
      console.log(this.offers);
      let filteredOffers = [];

      if (this.byWord != "") {
        this.offers.forEach(offer => {
          if(offer.salary >= this.minSalary &&
            offer.salary <= this.maxSalary && (
              offer.title.toLowerCase().includes(this.byWord.toLowerCase()) ||
              offer.location.toLowerCase().includes(this.byWord.toLowerCase()) ||
              offer.companyName.toLowerCase().includes(this.byWord.toLowerCase())))
          {
            filteredOffers.push(offer)
          }});
      }
      else {
        this.offers.forEach(offer => {
          if(offer.salary >= this.minSalary &&
            offer.salary <= this.maxSalary)
          {
            filteredOffers.push(offer)
          }
        });
      }

      let filteredTagedOffers = [];

      if (this.selectedTags.length > 0) {
        filteredOffers.forEach(offer => {
          for (const skill of offer.skills) {
            if (this.selectedTags.includes(skill)){
              filteredTagedOffers.push(offer);
              break;
            }
          }
        });

        this.setState({
          filtered : filteredTagedOffers
        })
      }
      else {
        this.setState({
          filtered : filteredOffers
        })
      }
    }

  render() { 
    const { Search } = Input;
    const { Text } = Typography;
    const marks = {
      0: '0€',
      20: '20K',
      40: '40K',
      60: '60K',
      80: '80K',
      100: '100K'
    };

    return (
      <div>
        <Row justify="center">
        <Col xs={24} sm={24} md={18} lg={16} xl={14} gutter={[16, 16]}>
          <AutoComplete style={{ width: '100%' }} options={this.state.suggestions}  filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }>
          <Search
            placeholder="Search offer by title, location or company"
            allowClear
            enterButton="Search"
            size="large"
            onSearch={this.onSearch}
          />
          </AutoComplete>
          <Divider />
          <Row>
              { this.state.skills.map( skill => {
                return (
                  <Tag.CheckableTag style={{ backgroundColor: skill.color}} key={skill.id} checked={this.selectedTags.indexOf(skill.id) > -1}
                  onChange={(checked) => this.handleChange(skill.id, checked)}>
                    {skill.name}
                  </Tag.CheckableTag >
                  ) }
                )
              }
          </Row>
          <Divider />
          <Row>
            <Col xs={6} sm={6} md={5} lg={3} xl={3}><Text style={{fontSize:'1rem', color:'gray'}}>{'Filter by price:   '}</Text></Col>
            <Col xs={18} sm={18} md={20} lg={21} xl={21}><Slider range marks={marks} defaultValue={[0, 80]} onChange={(value) => this.filterBySalary(value)}/></Col>
          </Row>
          <Row style={{justifyContent: 'right'}}><Text style={{color:'gray'}}>{ this.state.filtered.length + ' results'}</Text></Row>
          { this.state.filtered.map( offer => {
              offer.linkTo = "/offer/"+offer.id;
              if (offer.highlighted) {
                return(
                  <Link to={ offer.linkTo } >
                    <Badge.Ribbon text="Highlighted" color="#ff947f">
                      <Card hoverable key={offer.id} title={ offer.title } style={{ marginTop: 16 }}>
                        <Text strong >{ offer.companyName }</Text><br></br>
                        <Text >{ offer.location }</Text>
                        <Text strong style={{ fontSize:20, float: 'right', color:'#1890FF'}}>{ offer.salary + "€" }</Text>
                      </Card>
                    </Badge.Ribbon>
                  </Link>
                )
              }
              else {
                return (
                  <Link to={ offer.linkTo }>
                    <Card hoverable key={offer.id} title={<Text style={{fontSize: '1.2rem'}}>{offer.title}</Text>} style={{ marginTop: 16}}> 
                      <Text strong >{ offer.companyName }</Text><br></br>
                      <Text >{ offer.location }</Text>
                      <Text strong style={{ fontSize:20, float: 'right', color:'#1890FF'}}>{ offer.salary + "€" }</Text>
                    </Card>
                  </Link>
                )
              }
          })}
        </Col>
        </Row>
      </div>
    )
  }
}

export default OfferList;
