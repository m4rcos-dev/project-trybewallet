/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
  styled,
} from '@mui/material';
import {
  addEditExpense,
  editExpense,
  fetchCurrencyWallet,
  valueExpense,
} from '../redux/actions';
import TableExpenses from './TableExpenses';

const INITIAL_STATE = {
  value: '',
  description: '',
  currency: 'USD',
  method: 'Dinheiro',
  tag: 'Alimentação',
  exchangeRates: [],
};

class WalletForm extends Component {
  constructor() {
    super();
    this.state = {
      id: 0,
      value: '',
      description: '',
      currency: 'USD',
      method: 'Dinheiro',
      tag: 'Alimentação',
      exchangeRates: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchCurrencyWallet());
  }

  handleChange = ({ target }) => {
    const { name } = target;
    this.setState({ [name]: target.value });
  };

  addExpense = async (event) => {
    event.preventDefault();
    const response = await fetch('https://economia.awesomeapi.com.br/json/all');
    const data = await response.json();
    delete data.USDT;
    this.setState({ exchangeRates: data }, () => {
      const { dispatch } = this.props;
      dispatch(valueExpense(this.state));
      this.setState((previousState) => ({
        id: previousState.id + 1,
        ...INITIAL_STATE,
      }));
    });
  };

  addEditExpense = async (event) => {
    event.preventDefault();
    const { idToEdit, expenses } = this.props;
    const response = await fetch('https://economia.awesomeapi.com.br/json/all');
    const data = await response.json();
    delete data.USDT;
    this.setState({ exchangeRates: data, id: idToEdit }, () => {
      const currentIndex = expenses.findIndex((expense) => expense.id === idToEdit);
      const removeExpense = expenses
        .filter((currentExpense) => currentExpense.id !== idToEdit);
      const newExpense = [...removeExpense, expenses[currentIndex] = { ...this.state }];
      const newExpenseSort = newExpense.sort((a, b) => {
        if (a.id < b.id) {
          const validSort = -1;
          return validSort;
        }
        return true;
      });
      const { dispatch } = this.props;
      dispatch(addEditExpense(newExpenseSort));
      dispatch(editExpense(0, false));
      this.setState((previousState) => ({
        id: previousState,
        ...INITIAL_STATE,
      }));
    });
  };

  render() {
    // =============BreakPoints==========================
    const BoxCustom = styled(Box)(({ theme }) => ({
      [theme.breakpoints.down('md')]: {
        flexWrap: 'wrap',
      },
    }));

    const TextFieldCustom = styled(TextField)(() => ({
      margin: '0rem 0.7rem 0rem 0.7rem',
    }));

    const FormControlCustom = styled(FormControl)(() => ({
      margin: '0rem 0.7rem 0rem 0.7rem',
    }));

    const BoxCustomTable = styled(Box)(({ theme }) => ({
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    }));

    const { currencies, editor } = this.props;
    const {
      value,
      description,
      currency,
      method,
      tag,
    } = this.state;
    return (
      <Box
        sx={ {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#e1e5eb',
          borderRadius: '0.625rem',
          p: '3rem 1rem 1rem 1rem',
        } }
      >
        <BoxCustom
          sx={ {
            display: 'flex',
          } }
        >
          <TextFieldCustom
            fullWidth="true"
            size="small"
            id="filled-basic"
            label="Valor"
            variant="filled"
            type="number"
            name="value"
            onChange={ this.handleChange }
            value={ value }
          />
          <TextFieldCustom
            fullWidth="true"
            size="small"
            id="filled-basic"
            label="Breve Descrição"
            variant="filled"
            name="description"
            onChange={ this.handleChange }
            value={ description }
          />
          <FormControlCustom
            variant="filled"
            fullWidth="true"
            size="small"
            sx={ {
              minWidth: 120,
            } }
          >
            <InputLabel id="select-coin-label">Moeda</InputLabel>
            <Select
              labelId="select-coin-label"
              id="select-coin"
              name="currency"
              onChange={ this.handleChange }
              value={ currency }
            >
              {currencies.map((currentCurrency, index) => (
                <MenuItem
                  key={ `${currentCurrency}${index}` }
                  value={ currentCurrency }
                >
                  {currentCurrency}
                </MenuItem>
              ))}
            </Select>
          </FormControlCustom>
          <FormControlCustom
            fullWidth="true"
            size="small"
            variant="filled"
            sx={ {
              minWidth: 200,
            } }
          >
            <InputLabel id="select-method-label">Método de pagamento</InputLabel>
            <Select
              labelId="select-method-label"
              id="select-method"
              name="method"
              onChange={ this.handleChange }
              value={ method }
            >
              <MenuItem value="Dinheiro">Dinheiro</MenuItem>
              <MenuItem value="Cartão de crédito">Cartão de crédito</MenuItem>
              <MenuItem value="Cartão de débito">Cartão de débito</MenuItem>
            </Select>
          </FormControlCustom>
          <FormControlCustom
            fullWidth="true"
            size="small"
            variant="filled"
            sx={ {
              minWidth: 200,
            } }
          >
            <InputLabel id="select-tag-label">Categoria</InputLabel>
            <Select
              labelId="select-tag-label"
              id="select-tag"
              name="tag"
              onChange={ this.handleChange }
              value={ tag }
            >
              <MenuItem value="Alimentação">Alimentação</MenuItem>
              <MenuItem value="Lazer">Lazer</MenuItem>
              <MenuItem value="Trabalho">Trabalho</MenuItem>
              <MenuItem value="Transporte">Transporte</MenuItem>
              <MenuItem value="Saúde">Saúde</MenuItem>
            </Select>
          </FormControlCustom>
        </BoxCustom>
        <Box
          sx={ {
            width: '30%',
            p: '2rem 0rem 1rem 0rem',
          } }
        >
          {editor
            ? '' : (
              <Button
                sx={ {
                  width: '100%',
                  display: 'flex',
                  color: 'common.white',
                } }
                color="secondary"
                variant="contained"
                onClick={ this.addExpense }
              >
                Adicionar despesa
              </Button>
            )}
          {editor ? (
            <Button
              sx={ {
                width: '100%',
                display: 'flex',
                color: 'common.white',
              } }
              color="secondary"
              variant="contained"
              onClick={ this.addEditExpense }
            >
              Editar despesa
            </Button>
          ) : ''}
        </Box>
        <BoxCustomTable>
          <TableExpenses />
        </BoxCustomTable>
      </Box>
    );
  }
}

WalletForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  idToEdit: PropTypes.number.isRequired,
  editor: PropTypes.bool.isRequired,
  expenses: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
    tag: PropTypes.string.isRequired,
    exchangeRates: PropTypes.objectOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      ask: PropTypes.string.isRequired,
    })).isRequired,
  })).isRequired,
};

const mapStateToProps = (state) => ({
  ...state.wallet,
});

export default connect(mapStateToProps)(WalletForm);
