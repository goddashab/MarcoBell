import { Button, Drawer, List, message, Typography } from "antd";
import { useEffect, useState } from "react";
import { checkout, getCart } from "../utils";

const { Text } = Typography;

const MyCart = () => {
  const [cartVisible, setCartVisible] = useState(false);
  const [cartData, setCartData] = useState();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    // 每当弹窗弹开的时候拉一下
    if (!cartVisible) {
      return;
    }

    setLoading(true);
    getCart()
      .then((data) => {
        setCartData(data);
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [cartVisible]);
//   dependency array

  const onCheckOut = () => {
    setChecking(true);
    checkout()
      .then(() => {
        message.success("Successfully checkout");
        setCartVisible(false);
      })
      .catch((err) => {
        message.error(err.message);
    })
    .finally(() => {
      setChecking(false);
    });
};

const onCloseDrawer = () => {
  setCartVisible(false);
};

const onOpenDrawer = () => {
  setCartVisible(true);
};

return (
  <>
    <Button type="primary" shape="round" onClick={onOpenDrawer}>
      Cart
    </Button>
    <Drawer
      title="My Shopping Cart 购物车"
      onClose={onCloseDrawer}
      visible={cartVisible}
      width={520}
      footer={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Text strong={true}>{`Total price 总价: $${cartData?.totalPrice.toFixed(2)}`}</Text>
          <div>
            <Button onClick={onCloseDrawer} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button
              onClick={onCheckOut}
              type="primary"
              loading={checking}
              disabled={loading || cartData?.orderItemList.length === 0}
            >
              Checkout
            </Button>
          </div>
        </div>
      }
      >
      <List
        loading={loading}
        itemLayout="horizontal"
        dataSource={cartData?.orderItemList}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={item.menuItem.name}
              description={`$${item.price}`}
            />
          </List.Item>
        )}
      />
    </Drawer>
  </>
);
};

export default MyCart;
