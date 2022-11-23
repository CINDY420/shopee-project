interface DeepValidateProps {
  result: any
  expectedResultTypes: any
}

type deepValidateTypesFn = (props: DeepValidateProps) => void

// 递归对比key和value的值
export const deepValidateTypes: deepValidateTypesFn = ({ result, expectedResultTypes }) => {
  // If result is an object
  if (Object.prototype.toString.call(expectedResultTypes) === '[object Object]') {
    const keys = Object.keys(expectedResultTypes)
    // Test keys
    expect(result).to.have.all.keys(...keys)
    // Test type
    for (const key in expectedResultTypes) {
      const childType = expectedResultTypes[key]
      if (typeof childType === 'string') {
        // Ensure the value not be null
        result[key] !== null && expect(result[key]).to.a(expectedResultTypes[key])
      } else {
        const childResult = result[key]
        deepValidateTypes({ result: childResult, expectedResultTypes: childType })
      }
    }
  } else if (Array.isArray(expectedResultTypes)) {
    if (result.length > 0) {
      expect(expectedResultTypes.length).to.above(0)
      expect(result.length).to.above(0)
      // Only test the type of the first child in array
      const expectedResultType = expectedResultTypes[0]
      const firstChild = result[0]
      deepValidateTypes({ result: firstChild, expectedResultTypes: expectedResultType })
    }
  } else {
    // The input type is wrong
  }
}
