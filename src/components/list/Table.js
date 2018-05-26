import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { renderChangePercent } from '../../helpers';
import './Table.css';

const Table = (props) => {
  const { history, currencies } = props;

  return (
    <div className="Table-container">
      <table className="Table">
        <thead className="Table-head">
          <tr>
            <th>#</th>
            <th>Cryptocurrency</th>
            <th>Price</th>
            <th className="Table-marketCap">Market Cap</th>
            <th>24H Change</th>
          </tr>
        </thead>
        <tbody className="Table-body">
          {currencies.map(currency =>
            <tr
              key={currency.id}
              onClick={() => history.push(`/currency/${currency.id}`)}
            >
              <td>
                <span className="Table-rank">{currency.rank}</span>
              </td>
              <td>{currency.name}</td>
              <td>
                <span className="Table-dollar">$</span>
                {currency.price}
              </td>
              <td className="Table-marketCap">
                <span className="Table-dollar">$</span>
                {currency.marketCap}
              </td>
              <td>{renderChangePercent(currency.percentChange24h)}</td>
            </tr>)}
        </tbody>
      </table>
    </div>
  );
}

Table.propTypes = {
  currencies: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
}

export default withRouter(Table);
