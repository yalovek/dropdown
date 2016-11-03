# Dropdown

## Example

```
dropdownFactory({
  user_id: 0,
  multiple: true,
  autocomplete: true,
  request: true,
  avatar: true
}).render()
```

## Settings

- *user_id* - id of vk account, by default 0 for stub
- *multiple* - multiselect, by default false
- *autocomplete* - filter list on input, by default false
- *request* - make request to the server for additional data on input, by default false, autocomplete should be true
- *avatar* - show user photo, by default false
