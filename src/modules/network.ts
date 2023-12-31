import Node_Http from 'node:https';

global['Nets'] = { } as any;
Nets.GetAsJSON = async (url: string): Promise<object> => {
  if (!(/^(?:(http|https|ftp):\/\/)?((|[\w-]+\.)+[a-z0-9]+)(?:(\/[^/?#]+)*)?(\?[^#]+)?(#.+)?$/i).test(url)) {
    return {};
  };

  return new Promise(resolve => {
    var Result: string = '';
    Node_Http.get(url, cummingin => {
      cummingin.on('data', data => {
        Result += typeof data == 'object'
          ? JSON.stringify(data)
          : String(data);
      })
      .on('error', (error) => {
        throw new Errors.ErrorNetworkException(`[Network] GetAsJson() fail, ${error.name} - ${error.message}`);
      });
    });

    resolve(JsonEx.parse(Result));
  });
};

Nets['RequestAsJSON'] = async<T>(url: string, options: Node_Http.RequestOptions): Promise<T> => {
  if (!(/^(?:(http|https|ftp):\/\/)?((|[\w-]+\.)+[a-z0-9]+)(?:(\/[^/?#]+)*)?(\?[^#]+)?(#.+)?$/i).test(url)) {
    return {} as any;
  };

  return new Promise(resolve => {
    var Result: string = '';
    Node_Http.get(url, options, cummingin => {
      cummingin.on('data', data => {
        Result += typeof data == 'object'
          ? JSON.stringify(data)
          : String(data);
      })
      .on('error', (error) => {
        throw new Errors.ErrorNetworkException(`[Network] GetAsJson() fail, ${error.name} - ${error.message}`);
      });
    });
    resolve(JsonEx.parse(Result) as any);
  });
};