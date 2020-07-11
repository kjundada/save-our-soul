import React, { Component } from 'react';
import { 
    Dropdown, 
    DropdownToggle, 
    DropdownMenu, 
    DropdownItem,
    Button
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
    onClick = () => {
        window.location = `/connect?op=${this.state.selected_op}&problem=${this.state.selected_problem}`;
    }
    onChange = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    };
    render() {
        const to_help = "someone who feels";
        const seek_help = "because I feel";
        const cond_statement = (this.state.selected_op == "help") ? to_help : seek_help;
        const problems_list = this.state.problems.map((e, i) => 
            <DropdownItem value={e} id="selected_problem" onClick={this.onChange} index={i}>{e}</DropdownItem>
        );
        return (
            <div className="landing">
                <div className="center">
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
                    <Button onClick={this.onClick} className="chat-btn">Start Chat</Button>
                </div>
            </div>
        );
    }
}

export default LandingPage;