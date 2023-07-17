const axios = require('axios');

const postParamsToUrl = async (params, url) => {
  try {
    const response = await axios.post(url, params);
    console.log('POST request successful:', response.data);
  } catch (error) {
    console.error('Error occurred while making POST request:', error);
  }
};

const consumeSQSMessages = async (event) => {
  for (const record of event.Records) {
    const message = JSON.parse(record.body);
    const ProductId = message.MessageAttributes.MessageAttributeProductId.Value;
    const FactoryId = message.MessageAttributes.MessageAttributeFactoryId.Value;
    

    const params = {
      MessageGroupId : "stock-arrival-group",
      MessageAttributeProductId: ProductId,
      MessageAttributeProductCnt: "2",
      MessageAttributeFactoryId: FactoryId,
      MessageAttributeRequester: "이주형",
      CallbackUrl : "https://6446thm7yf.execute-api.ap-northeast-2.amazonaws.com/product/donut"
    };

    console.log("Processed message:", params);

    await postParamsToUrl(params, 'http://project3-factory.coz-devops.click/api/manufactures');
  }
};

module.exports.consumer = consumeSQSMessages;
