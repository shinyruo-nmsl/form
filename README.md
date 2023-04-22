# A Form Class

form is something composed of data and behavior, so designing it as a class is very appropriate

you may have a form as follow:
```typescript
interface IAddressForm {
  name: string;
  phone: number;
  region: string;
}
```
you can use a abstract class named 'Form' to make it have some behaviors as follow:
```typescript
import { Form, registRule } from "./form";

class AddressForm extends Form implements IAddressForm {
  constructor(
    public name: string,
    public phone: number,
    public region: string
  ) {
    super();
  }

  // you can use method decorator to regist some rules you need to validate the data
  @registRule("name")
  checkName() {
    if (!this.name) throw new Error("please write your name");
  }

  @registRule("phone")
  checkPhone() {
    if (!this.phone) throw new Error("please write your phone");
    if (typeof this.phone !== "number")
      throw new Error("please write correct phone");
  }

  @registRule("region")
  checkRegion() {
    if (!this.region) throw new Error("please write your region");
  }

  // after validate the data, you may need to provide some data to Server
  buildForm() {
    return {
      _name: this.name,
      _phone: this.phone,
      _region: this.region,
    };
  }
}
```
then you can use the 'AddressForm' above as a method in a framework such as vue :
```typescript
function checkAddressForm() {
  const addressForm = new AddressForm("", 122334, "");
  try {
    addressForm.check();
    /**
     * if you just want to check name and phone in first step:
     * addressForm.check(['name', 'phone']);
     */
  } catch (e) {
    alert(e.message);
  }
  return addressForm.buildForm();
}
```
maybe you have a new form on the basis of 'IAddressForm':
```typescript
interface ISubAddressForm extends IAddressForm {
  gender: "M" | "F";
  recivingType: string;
}
```
you can extends 'AddressForm':
```typescript
class SubAddressForm extends AddressForm {
  constructor(
    public name: string,
    public phone: number,
    public region: string,
    public gender: "M" | "F",
    public recivingType: string
  ) {
    super(name, phone, region);
  }

  @registRule("gender")
  checkGender() {
    if (!this.gender) throw new Error("please write your gender");
  }

  @registRule("recivingType")
  checkRecivingType() {
    if (!this.recivingType) throw new Error("please write your recivingType");
  }

  buildForm() {
    return {
      _name: this.name,
      _phone: this.phone,
      _region: this.region,
      _gender: this.gender,
      _recivingType: this.recivingType,
    };
  }
}

const subAddressForm = new SubAddressForm("", 122334, "", "F", "");
```
then you can also validate the data as follow:
```typescript
subAddressForm.check(['name', 'phone'])
```
it works because the 'subAddressForm' can find the rules about 'name' and 'phone' by proto, I has helped you to handle it

more details:
https://zhuanlan.zhihu.com/p/590965689
