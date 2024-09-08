SELECT
    id,
    (
        select
            first_name || " " || last_name
        from
            users
        where
            posts.uid = users.id
    ) as name
FROM
    posts
ORDER BY
    d DESC
LIMIT
    1