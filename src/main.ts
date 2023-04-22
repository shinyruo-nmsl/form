import { Form, registRule } from "./form";

interface IAddressForm {
  name: string;
  phone: number;
  region: string;
}

class AddressForm extends Form implements IAddressForm {
  constructor(
    public name: string,
    public phone: number,
    public region: string
  ) {
    super();
  }

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

  buildForm() {
    return {
      _name: this.name,
      _phone: this.phone,
      _region: this.region,
    };
  }
}

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

interface ISubAddressForm extends IAddressForm {
  gender: "M" | "F";
  recivingType: string;
}

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

function checkSubAddressForm() {
  const subAddressForm = new SubAddressForm("", 122334, "", "F", "");
  try {
    subAddressForm.check();
  } catch (e) {
    alert(e.message);
  }
  return subAddressForm.buildForm();
}
