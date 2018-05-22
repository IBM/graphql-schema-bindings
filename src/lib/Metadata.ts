import "reflect-metadata";

const ARGS = Symbol("ARGS");
const CONTEXT = Symbol("CONTEXT");
const DEFAULT_VALUE = Symbol("DEFAULT_VALUE");
const DEPRECATED = Symbol("DEPRECATED");
const DESC = Symbol("DESC");
const FIELD = Symbol("FIELD");
const FIELDS = Symbol("FIELDS");
const INPUT = Symbol("INPUT");
const NON_NULL = Symbol("NON_NULL");
const TYPE = Symbol("TYPE");

function argumentKey(propertyKey, index) {
  return `${propertyKey}.${index}`;
}

export default class Metadata {
  target;
  propertyKey?: string;
  index?: number;

  static for(target, propertyKey?, index?) {
    return new Metadata(target, propertyKey, index);
  }
  constructor(target, propertyKey, index) {
    this.target = target;
    this.propertyKey = propertyKey;
    this.index = index;
  }
  get key() {
    return typeof this.index === "number"
      ? argumentKey(this.propertyKey, this.index)
      : this.propertyKey;
  }
  get args() {
    return this.getValue(ARGS);
  }
  set args(value) {
    this.setValue(ARGS, value);
  }
  get context() {
    return this.getValue(CONTEXT);
  }
  set context(value) {
    this.setValue(CONTEXT, value);
  }
  get defaultValue() {
    return this.getValue(DEFAULT_VALUE);
  }
  set defaultValue(value) {
    this.setValue(DEFAULT_VALUE, value);
  }
  get deprecated() {
    return this.getValue(DEPRECATED);
  }
  set deprecated(value) {
    this.setValue(DEPRECATED, value);
  }
  get description() {
    return this.getValue(DESC);
  }
  set description(value) {
    this.setValue(DESC, value);
  }
  get field() {
    return this.getValue(FIELD);
  }
  set field(value) {
    this.setValue(FIELD, value);
  }
  get fields() {
    return this.getValue(FIELDS);
  }
  set fields(value) {
    this.setValue(FIELDS, value);
  }
  get fieldType() {
    return this.getValue("design:type");
  }
  get input() {
    return this.getValue(INPUT);
  }
  set input(value) {
    this.setValue(INPUT, value);
  }
  get nonNull() {
    return this.getValue(NON_NULL);
  }
  set nonNull(value) {
    this.setValue(NON_NULL, value);
  }
  get paramTypes() {
    return this.getValue("design:paramtypes");
  }
  get returnType() {
    return this.getValue("design:returntype");
  }
  get type() {
    return this.getValue(TYPE);
  }
  set type(value) {
    this.setValue(TYPE, value);
  }
  getValue(key) {
    return this.key
      ? Reflect.getMetadata(key, this.target, this.key)
      : Reflect.getMetadata(key, this.target);
  }
  setValue(key, value) {
    return this.key
      ? Reflect.defineMetadata(key, value, this.target, this.key)
      : Reflect.defineMetadata(key, value, this.target);
  }
}
