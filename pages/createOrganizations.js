import BasePage from "./basePage";  
import{displayName} from "../data/testData.json"


class CreateOrganizations extends BasePage {
    constructor(page) {
        super(page);
        this.page=page;
    }
}
    

export default CreateOrganizations;