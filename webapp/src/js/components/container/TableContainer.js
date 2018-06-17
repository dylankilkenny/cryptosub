import React from 'react';
import Table from "../presentational/Table";


class TableContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subs: []
        }
        this.storeSubreddits = this.storeSubreddits.bind(this);
    }

    componentDidMount() {
        const apiUrl = "http://localhost:3000/Subreddits"
        fetch(apiUrl)
            .then(response => {return response.json()})
            .then(data => {
                console.log(data)
                this.storeSubreddits(data)
            })
            .catch(error => console.log(error))
    }

    componentDidCatch(error, info) {
        console.log(error)
        console.log(info)
    }

    storeSubreddits = data => {
        var i = 0;
        const subs = data.map(d => {
            i++;
            return {
                key: i,
                rank: i,
                subreddit: d.id,
                tf_hr_total: d.one_day_total,
                tf_hr_change: d.one_day_change,
                seven_day_total: d.seven_day_total,
                seven_day_change: d.seven_day_change,
                thirty_day_total: d.thirty_day_total,
                thirty_day_change: d.thirty_day_change,
            }
        })
        this.setState({ subs })
    }

    render() {
        return (
            <div>
                <Table
                    subreddits={this.state.subs}
                    />
            </div>
        )
    }
}
export default TableContainer
