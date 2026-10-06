# cURL commands (run these yourself and paste the REAL output under each)

Replace BASE with your deployed backend URL (e.g. https://xxxx.appspot.com or http://localhost:3060).

## mainpage  (Task 13)
curl -s BASE/api/gifts

## register  (Task 14)
curl -s -X POST BASE/api/auth/register -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","firstName":"Test","lastName":"User","password":"Pass1234"}'

## login  (Task 15)
curl -s -X POST BASE/api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Pass1234"}'

## item_detail  (Task 16)  -- use a real id from your gifts collection
curl -s BASE/api/gifts/<ID>

## search_item  (Task 17)
curl -s "BASE/api/search?name=chair&category=Living"

## inserted_items  (Task 3)
mongoimport --uri "$MONGO_URL/giftdb" --collection gifts --file gifts.json --jsonArray
