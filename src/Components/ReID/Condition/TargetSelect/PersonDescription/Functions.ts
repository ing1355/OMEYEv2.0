import { DescriptionCategoryKeyType, descriptionColorType, descriptionDataType, descriptionPatternType, descriptionSubDataKeys, descriptionValueDataKeys } from "./DescriptionType";

export const createValueChangedDescription = <
  MainKey extends DescriptionCategoryKeyType,
  SubKey extends keyof descriptionDataType[MainKey],
>(
  original: descriptionDataType,
  mainKey: MainKey,
  subKey: SubKey,
  value: descriptionDataType[MainKey][SubKey],
) => {
  let outerColor = original.outer.color
  let innerColor = original.inner.color
  let bottomColor = original.bottom.color

  let colorTemp = mainKey === 'outer' ? outerColor : mainKey === 'inner' ? innerColor : mainKey === 'bottom' ? bottomColor : []

  if(subKey === 'pattern' && !(value === 'colorblocking' || value === 'pattern')) {
    return {
      ...original,
      [mainKey]: {
        ...original[mainKey],
        [subKey]: value,
        color: [colorTemp[0]]
      }
    }
  } else {
    return {
      ...original,
      [mainKey]: {
        ...original[mainKey],
        [subKey]: value
      }
    }
  }
};

export const createColorChangedDescription = (data: descriptionColorType[], pattern: descriptionPatternType, color: descriptionColorType) => {
  if (data.includes(color)) return data.filter(_ => _ !== color)
  if (pattern === 'colorblocking' || pattern === 'pattern') {
    return [color, ...data].slice(0, 3)
  } else {
    return [color]
  }
}

export const hasValuePersonDescription = (data: descriptionDataType): boolean => {
  const { general, bottom, etc, shoes, inner, outer } = data
  // if (general.age || general.gender || general.hair ||
  if (general.gender || general.hair ||
    bottom.color.length > 0 || bottom.pattern || bottom.type ||
    etc.bag || etc.glasses || etc.mask || etc.walkingaids ||
    shoes.type ||
    inner.color.length > 0 || inner.pattern ||
    outer.color.length > 0 || outer.pattern || outer.shape || outer.type) return true
  return false
}