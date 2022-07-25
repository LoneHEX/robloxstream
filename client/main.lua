local ws = syn.websocket.connect('ws://localhost:90')

ws.OnMessage:Connect(function(msg)
    local img = Drawing.new('Image')
    img.Data = msg
    img.Size = Vector2.new(1920, 1080)
    img.Position = Vector2.new(0, 0)
    img.Rounding = 0
    img.Visible = true
    print('got msg: ')
end)