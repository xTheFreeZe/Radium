/**
 * RADIUM COMPILER TOKENIZATION
 *
 * Radium is my own programming language. This file contains the tokenization
 * Copyright (C) 2024 - Marwin Eder
 */

// eslint-disable-next-line no-shadow
enum TokenType {
  _return = 'return',
  int_literal = 'int_literal',
  semi_colon = 'semi_colon',
}

interface Token {
  type: TokenType;
  line: number;
  value?: string;
}

class Buffer {

  private buffer: string;

  constructor() {
    this.buffer = '';
  }

  public append(char: string | number | undefined): void {
    if (char) {
      this.buffer += char;
    }
  }

  public clear(): void {
    this.buffer = '';
  }

  public get value(): string {
    return this.buffer;
  }
}

class CharacterStream {

  private readonly src: string;
  private index: number;

  constructor(src: string) {
    this.src = src;
    this.index = 0;
  }

  public peek(offset: number = 0): string | undefined {
    if (this.index + offset >= this.src.length) {
      return undefined;
    }
    return this.src[this.index + offset];
  }

  public consume(): string | undefined {
    if (this.index >= this.src.length) {
      return undefined;
    }
    return this.src[this.index++];
  }
}

const isAlnum = (char: string | undefined): false | RegExpMatchArray | null => {
  if (char) {
    return char.match(/[a-zA-Z0-9]/);
  } else {
    return false;
  }
};

const isInt = (input: string | number | undefined): boolean => {
  if (input) {
    return Number.isInteger(+input);
  } else {
    return false;
  }
};


/**
 * Tokenizes the input.
 *
 * Tokenization is the process of converting a string into a list of tokens
 *
 * @param input {string} - The input to tokenize
 * @returns {Token[]} - The list of tokens
 */
const tokenize = (input: string): Token[] => {

  const tokens: Token[] = [];
  const stream = new CharacterStream(input);

  const buffer = new Buffer();
  let lineCount = 1;

  while (stream.peek()) {
    if (isAlnum(stream.peek())) {

      buffer.append(stream.consume());

      while (stream.peek() && isAlnum(stream.peek())) {
        buffer.append(stream.consume());
      }

      if (buffer.value === 'return') {
        tokens.push({ type: TokenType._return, line: lineCount });
        buffer.clear();
      }

    } else if (isInt(stream.peek())) {

      buffer.append(stream.consume());

      while (stream.peek() && isInt(stream.peek())) {
        buffer.append(stream.consume());
      }

      tokens.push({ type: TokenType.int_literal, line: lineCount, value: buffer.value });
      buffer.clear();

    } else if (stream.peek() === ';') {

      tokens.push({ type: TokenType.semi_colon, line: lineCount });
      stream.consume();

    } else if (stream.peek() === ' ') {

      stream.consume();

    } else if (stream.peek() === '\n') {
      
      stream.consume();
      lineCount++;

    } else {

      throw new Error(`Unexpected character: ${stream.peek()}`);

    }

  }

  return tokens;

};

export default tokenize;