class Checker {
  checkMap: Map<string, (() => void | Error)[]> = new Map();

  // 根据标识将验证函数注入map
  add(checks: { key: string; fn: () => void | Error }[]) {
    checks.forEach((check) => {
      const fns = this.checkMap.get(check.key);
      if (!fns) {
        this.checkMap.set(check.key, [check.fn]);
      } else {
        fns.push(check.fn);
      }
    });
  }

  // 如果用户提供了标识，那么只验证标识对应的验证函数
  check(context: Form, keys?: string[]): true | Error {
    if (keys) {
      keys.forEach(
        (key) =>
          this.checkMap.get(key) &&
          this.checkMap.get(key)!.forEach((check) => check.call(context))
      );
    } else {
      this.checkMap.forEach((checkList) =>
        checkList.forEach((check) => check.call(context))
      );
    }
    return true;
  }
}

export function registRule(key: string) {
  return function <T extends Form, P extends { value?: () => void | Error }>(
    target: T,
    methodName: string,
    descriptor: P
  ) {
    // 向原型的checker中注入该方法
    if (!target.hasOwnProperty.call(target, "checker")) {
      target.checker = new Checker();
    }
    target.checker.add([{ key, fn: descriptor.value! }]);
  };
}

interface IForm {
  [prop: string]: any;
  check(): Error | true;
  buildForm(): Record<string, unknown>;
}

export abstract class Form implements IForm {
  checker: Checker = new Checker();

  // 通过原型链往上追溯，逐一验证
  check(keys?: string[]): true | Error {
    let proto = Object.getPrototypeOf(this);
    while (proto) {
      proto.checker && proto.checker.check(this, keys);
      proto = Object.getPrototypeOf(this);
    }
    return true;
  }

  abstract buildForm(): Record<string, unknown>;
}
