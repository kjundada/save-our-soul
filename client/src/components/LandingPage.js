import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { 
    Dropdown, 
    DropdownToggle, 
    DropdownMenu, 
    DropdownItem,
    Button,
    Form
} from 'reactstrap';

class LandingPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            problems        : ["lonely", "suicidal", "extremely depressed",
                            "homesick", "betrayed", "the loss of loved one",
                            "to harm myself"],
            ops             : ["help", "seek help"],
            selected_op     : "help",
            selected_problem: "lonely",
            isdrop_1        : false,
            isdrop_2        : false
        }
    }
    onSubmit = () => {
        const user_input = {
            operation   : this.state.selected_op,
            problem     : this.state.selected_problem
        }
        console.log(user_input);
        this.props.history.push(`/connect?op=${user_input.operation}&problem=${user_input.problem}`);
    }
    onChange = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    };
    render() {
        const to_help = "someone who feels";
        const seek_help = "because I feel";
        const cond_statement = (this.state.selected_op == "help") ? to_help : seek_help;
        const problems_list = this.state.problems.map((e, i) => 
            <DropdownItem key={i} value={e} id="selected_problem" onClick={this.onChange} index={i}>{e}</DropdownItem>
        );
        return (
            <div className="landing">
                <div className="heading-text">
                    Save Our Soul
                </div>
                <div className="center">
                    <Form noValidate onSubmit={this.onSubmit}>
                        <h1>I am here to</h1>
                        <div className="drop-it">
                            <Dropdown isOpen={this.state.isdrop_1} toggle={() => this.setState({isdrop_1: !this.state.isdrop_1})}>
                                <DropdownToggle className="menu" caret>
                                    {this.state.selected_op}
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem value="help" id="selected_op" onClick={this.onChange}>help</DropdownItem>
                                    <DropdownItem value="seek help" id="selected_op" onClick={this.onChange}>seek help</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                        <h1>{cond_statement}</h1>
                        <div className="drop-it">
                            <Dropdown isOpen={this.state.isdrop_2} toggle={() => this.setState({isdrop_2: !this.state.isdrop_2})}>
                                <DropdownToggle className="menu" caret>
                                    {this.state.selected_problem}
                                </DropdownToggle>
                                <DropdownMenu>
                                    {problems_list}
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                        <Button className="chat-btn">Start Chat</Button>
                    </Form>
                    <br/>
                    <div className="intro">                        
                        Hey! We know quarantine has been hard on all of us. 
                        We are separated from our family, have to face the 
                        loss of our loved ones. Even if you just feel lonely 
                        or depressed, we want you to know we are here for you. 
                        Here you can seek help from your peers. 
                        We hope this helps!!
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(LandingPage);