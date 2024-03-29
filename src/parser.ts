/**
 * RADIUM COMPILER
 *
 * Copyright (C) 2024 - Marwin
*/

import { Token, Nodes } from './interfaces/interfaces';
import { TokenType } from './tokenization';

class Parser {

  private tokens: Token[];
  private index: number;
  private currentToken: Token;
  private parsedStatements: Nodes[] = [];

  constructor(tokens: Token[]) {
    this.tokens = [...tokens];
    this.index = 0;
    this.currentToken = this.tokens[this.index];
  }

  public peek(offset: number = 0): Token | undefined {
    if (this.index + offset >= this.tokens.length) {
      return undefined;
    }
    return this.tokens[this.index + offset];
  }

  public consume(): Token {
    return this.currentToken = this.tokens[this.index++];
  }

  public parse(): Nodes[] | undefined {

    while (this.peek()) {

      if (this.peek()?.type === 'quit') {

        this.currentToken = this.consume();

        if (this.peek()?.type !== 'open_paren') {
          throw new Error(`On line ${this.currentToken.line} -> expected '(' after 'quit' statement`);
        }

        this.currentToken = this.consume();
        const expression = this.consume();

        if (expression.type !== 'int_literal') {
          throw new Error(`On line ${expression.line} -> expected integer literal after '(' in 'quit' statement`);
        }

        if (this.peek()?.type !== 'close_paren') {
          throw new Error(`On line ${this.currentToken.line} -> expected ')' after integer literal in 'quit' statement`);
        }

        this.currentToken = this.consume();

        if (this.peek()?.type !== 'semi_colon') {
          throw new Error(`On line ${this.currentToken.line} -> expected ';' after 'quit' statement`);
        }

        this.currentToken = this.consume();

        this.parsedStatements.push({
          quitStatement: {
            token: TokenType.quit,
            expression: {
              token: expression,
            },
          },
        });

        if (this.peek()) {
          throw new Error(`Token '${this.peek()?.type}' on line ${this.peek()?.line} is unreachable -> Expected end of file or scope`);
        }

      } else if (this.peek()?.type === 'log') {

        this.currentToken = this.consume();

        if (this.peek()?.type !== 'open_paren') {
          throw new Error(`On line ${this.currentToken.line} -> expected '(' after 'log' statement`);
        }

        this.currentToken = this.consume();
        const expression = this.consume();

        if (expression.type !== 'int_literal') {
          throw new Error(`On line ${expression.line} -> expected integer literal after '(' in 'log' statement`);
        }

        if (this.peek()?.type !== 'close_paren') {
          throw new Error(`On line ${this.currentToken.line} -> expected ')' after integer literal in 'log' statement`);
        }

        this.currentToken = this.consume();

        if (this.peek()?.type !== 'semi_colon') {
          throw new Error(`On line ${this.currentToken.line} -> expected ';' after 'log' statement`);
        }

        this.currentToken = this.consume();

        this.parsedStatements.push({
          logStatement: {
            token: TokenType.log,
            expression: {
              token: expression,
            },
          },
        });

      } else if (this.peek()?.type === 'const' || this.peek()?.type === 'let') {

        const constant = this.consume();

        if (this.peek()?.type !== 'alpha_numeric') {
          throw new Error(`On line ${this.currentToken.line} -> expected variable name after 'let' or 'const' keyword`);
        }

        const identifier = this.consume();

        if (this.peek()?.type !== 'equal') {
          throw new Error(`On line ${this.currentToken.line} -> expected '=' after variable name`);
        }

        this.currentToken = this.consume();
        const value = this.consume();

        if (this.currentToken.type !== 'int_literal') {
          throw new Error(`On line ${this.currentToken.line} -> expected integer literal after '=' -> For now, only integer literals are supported`);
        }

        if (this.peek()?.type !== 'semi_colon') {
          throw new Error(`On line ${this.currentToken.line} -> expected ';' after integer literal`);
        }

        this.currentToken = this.consume();

        this.parsedStatements.push({
          variableDeclaration: {
            token: constant.type === 'const' ? TokenType._const : TokenType._let,
            identifier: identifier,
            value: value,
            constant: constant.type === 'const' ? true : false,
          },
        });

      } else {
        throw new Error('Unexpected token');
      }

    }

    return this.parsedStatements;

  }

}

export default Parser;