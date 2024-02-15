/**
 * RADIUM COMPILER
 *
 * Copyright (C) 2024 - Marwin Eder
*/

import { TokenType } from '../tokenization';

export interface Token {
  type: TokenType;
  line: number;
  value?: string;
}

export interface NodeExpression {
  token: Token;
}

export interface NodeReturnStatement {
  token: TokenType;
  expression: NodeExpression;
}