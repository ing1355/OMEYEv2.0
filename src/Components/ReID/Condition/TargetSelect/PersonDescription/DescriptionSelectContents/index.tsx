import { DescriptionCategoryKeyType } from "../DescriptionType"
import DescriptionBottomSelect from "./DescriptionBottomSelect"
import DescriptionETCSelect from "./DescriptionETCSelect"
import DescriptionGeneralSelect from "./DescriptionGeneralSelect"
import DescriptionInnerSelect from "./DescriptionInnerSelect"
import DescriptionOuterSelect from "./DescriptionOuterSelect"
import DescriptionShoesSelect from "./DescriptionShoesSelect"

const DescriptionSelectContents = ({type}: {
    type: DescriptionCategoryKeyType
}) => {
    switch(type) {
        case 'general':
            return <DescriptionGeneralSelect/>
        case 'outer':
            return <DescriptionOuterSelect/>
        case 'inner':
            return <DescriptionInnerSelect/>
        case 'bottom':
            return <DescriptionBottomSelect/>
        case 'shoes':
            return <DescriptionShoesSelect/>
        case 'etc':
            return <DescriptionETCSelect/>
    }
}

export default DescriptionSelectContents