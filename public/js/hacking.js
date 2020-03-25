function hack(player, password) {
    if (player.password === password) {
        commandOutput.setValue("success");
        if (player === player2) {
            aceEditor2.setValue(player.code);
        } else if (player === player1) {
            aceEditor1.setValue(player.code);
        }
        
        
    } else {
        commandOutput.setValue("failure");
    }
}
